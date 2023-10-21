import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Users } from './users.model';
import { Auth } from 'src/auth/auth.model';
import { ObjectId } from 'mongodb';
import { Companies } from 'src/companies/companies.model';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    @InjectModel('Users') private readonly usersModel: Model<Users>,
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    @InjectModel('Companies') private readonly companiesModel: Model<Companies>,
  ) {}

  async getUsers(filter: {
    location: string;
    keywords: string;
    salary?: number[];
    jobType?: string[];
    sort?: string[];
    page?: number;
  }): Promise<{ users: Users[]; documentsLength: number }> {
    const { location, keywords, salary, jobType, sort, page } = filter;

    const locationRegex = new RegExp(location, 'i');
    const keywordsRegex = new RegExp(keywords, 'i');
    const [minSalary, maxSalary] = salary || [0, 5000];
    const usersPerPage = 10;
    const skipAmount = (page - 1) * usersPerPage;
    const sortOrder = sort && sort.includes('Oldest') ? 1 : -1;

    const query = {
      $and: [
        {
          $or: [
            {
              city: { $regex: locationRegex },
            },
            { country: { $regex: locationRegex } },
          ],
        },
        { about: { $regex: keywordsRegex } },
        {
          $and: !jobType ? [{}] : [{ job_type: { $all: jobType } }],
        },
        {
          $or: [
            { rate: { $exists: false } },
            { rate: { $gte: minSalary, $lte: maxSalary } },
          ],
        },
      ],
    };

    const users: Users[] = await this.usersModel
      .find(query)
      .sort({ _id: sortOrder })
      .skip(skipAmount)
      .limit(usersPerPage)
      .exec();

    const documentsLength = await this.usersModel.find(query).countDocuments();

    return { users, documentsLength };
  }

  async getSingleFreelancer(id: string): Promise<object> {
    const freelancer: object = await this.usersModel.find({ _id: id }).exec();

    return { ...freelancer };
  }

  async createUser(userData: {
    email: string;
    password: string;
    confirmPassword: string;
    accountType: string;
  }): Promise<object> {
    const hashedPass = await bcrypt.hash(userData.password, 12);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...restOfUserData } = userData;
    const newUser = new this.usersModel({
      ...restOfUserData,
      password: hashedPass,
    });
    const saving = await newUser.save();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = saving;

    return result;
  }

  async createGoogleUser(userData: any): Promise<object> {
    const newUser = new this.usersModel({
      ...userData,
    });
    return await newUser.save();
  }

  async findUser(email: string): Promise<Users> {
    let user: Users;

    try {
      user = await this.usersModel.findOne({ email }).exec();
    } catch (error) {
      throw new NotFoundException('Could not find the user');
    }

    if (!user) throw new NotFoundException('Could not find the user');

    return user;
  }

  async changeUserData(id: string, data: any): Promise<object> {
    // check data.data is from FormData() of changing the settings
    // and just data is a regular changing
    const parsedData = data.data ? JSON.parse(data.data) : data;

    const updatedUser = (
      await this.usersModel
        .findOneAndUpdate(
          { _id: id },
          { $set: { ...parsedData } },
          { new: true },
        )
        .exec()
    ).toJSON();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = updatedUser;

    return {
      ...user,
    };
  }

  async subscribeUser(data: any, type: string) {
    const user = (
      await this.usersModel
        .findOneAndUpdate(
          {
            $or: [{ _id: data.id }, { email: data.email }],
          },
          {
            $set: {
              [`subscriptions.${type}`]: {
                value: data.value,
                query: data.alertsQuery || null,
              },
            },
          },
          { new: true },
        )
        .exec()
    ).toJSON();

    if (!user) throw new NotFoundException('Could not find the user');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = user;
    return { ...updatedUser };
  }

  // find all bookmarks that user has
  async getBookmarks({
    bookmarks,
    userId,
  }: {
    bookmarks?: {
      jobs?: string[] | ObjectId[];
      freelancers?: string[] | ObjectId[];
    };
    userId?: string | ObjectId;
  }): Promise<{ jobs: any; freelancers: any }> {
    if (!bookmarks) {
      const user = await this.usersModel.findOne({ _id: userId });

      bookmarks = user?.bookmarks;
    }

    const { jobs, freelancers } = bookmarks;
    const jobIds = jobs?.map((id: string | ObjectId) => new ObjectId(id));
    const freelancersIds = freelancers?.map(
      (id: string | ObjectId) => new ObjectId(id),
    );

    // searching vacancies that user has bookmarked
    const aggregatedJobData = await this.companiesModel.aggregate([
      {
        $match: {
          'current_vacancies._id': {
            $in: jobIds,
          },
        },
      },
      { $sort: { 'current_vacancies._id': 1 } },
      { $unwind: '$current_vacancies' },
      {
        $group: {
          _id: '$_id',
          current_vacancies: { $push: '$current_vacancies' },
          avatar: { $first: '$avatar' },
          name: { $first: '$name' },
        },
      },
      {
        $project: {
          _id: 1,
          current_vacancies: 1,
          avatar: 1,
          name: 1,
        },
      },
    ]);

    const allCurrentVacancies = aggregatedJobData.flatMap((companyData) => {
      const avatar = companyData.avatar;
      const company = companyData.name;

      return companyData.current_vacancies.map((vac) => ({
        ...vac,
        avatar,
        company,
      }));
    });

    // searching freelancers that user has bookmarked and removing the pass
    const freelancerData = await this.usersModel.find({
      _id: { $in: freelancersIds },
    });

    const flWithNoPass = freelancerData.map((doc) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = doc.toJSON();

      return rest;
    });

    return { jobs: allCurrentVacancies, freelancers: flWithNoPass };
  }

  async deleteBookmarks(data: {
    userId: string | ObjectId;
    itemId: string | ObjectId;
    userEmail: string;
    type: 'jobs' | 'freelancers';
  }) {
    const { itemId, userEmail, type, userId } = data;

    const user = (
      await this.usersModel.findOneAndUpdate(
        { $or: [{ email: userEmail }, { _id: userId }] },
        { $pull: { [`bookmarks.${type}`]: itemId } },
        { new: true },
      )
    ).toJSON();

    if (!user) throw new NotFoundException('User not found');

    // find the bookmarks to return them 'cuz in db it's just an array of ids
    const { jobs, freelancers } = await this.getBookmarks({
      bookmarks: user?.bookmarks,
      userId,
    });

    return {
      ...user,
      bookmarks: { jobs: jobs || [], freelancers: freelancers || [] },
    };
  }

  async addBookmarks(data: {
    userId: string | ObjectId;
    itemId: string | ObjectId;
    userEmail: string;
    type: 'jobs' | 'freelancers';
  }) {
    const { itemId, userEmail, type, userId } = data;

    const user = (
      await this.usersModel
        .findOneAndUpdate(
          { $or: [{ email: userEmail }, { _id: userId }] },
          { $addToSet: { [`bookmarks.${type}`]: itemId } },
          { new: true },
        )
        .exec()
    ).toJSON();

    if (!user) throw new NotFoundException('User not found');

    const { jobs, freelancers } = await this.getBookmarks({
      bookmarks: user?.bookmarks,
    });
    // getting rid of the passwords
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...fullUser } = user;

    return {
      ...fullUser,
      bookmarks: { jobs, freelancers },
    };
  }
}
