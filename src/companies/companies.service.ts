import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Companies } from './companies.model';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.model';

@Injectable()
export class CompaniesService {
  constructor(
    private usersService: UsersService,
    @InjectModel('Companies') private readonly companiesModel: Model<Companies>,
  ) {}

  async getCompanies(filter: {
    location: string;
    keywords: string;
    salary: number[];
    jobType: string[];
    sort: string[];
    page: number;
  }): Promise<{ companies: Companies[]; documentsLength: number }> {
    const { location, keywords, salary, jobType, sort, page } = filter;

    const companiesPerPage = 10;
    const skipAmount = (page - 1) * companiesPerPage;
    const sortOrder = sort.includes('Oldest') ? 1 : -1;

    const query = {};

    const companies: Companies[] = await this.companiesModel
      .find(query)
      .sort({ _id: sortOrder })
      .skip(skipAmount)
      .limit(companiesPerPage)
      .exec();

    const documentsLength = await this.companiesModel
      .find(query)
      .countDocuments();

    return {
      companies,
      documentsLength,
    };
  }

  async getJobs(filter: {
    location: string;
    keywords: string;
    salary: number[];
    jobType: string[];
    sort: string[];
    page: number;
  }): Promise<{
    jobs: {
      avatar: string;
      position: string;
      description: string;
      salary: number[];
      job_type: Array<string>;
      posted: Date;
      city: string;
      feedbacks: [
        {
          reviewer_name: string;
          rating: number;
          date: Date;
          comment: string;
          isAnonymous: boolean;
        },
      ];
    }[];
    documentsLength: number;
  }> {
    const { location, keywords, salary, jobType, sort, page } = filter;

    const locationRegex = new RegExp(location, 'i');
    const keywordsRegex = new RegExp(keywords, 'i');
    const [minSalary, maxSalary] = salary;

    const jobsPerPage = 10;
    const skipAmount = (page - 1) * jobsPerPage;
    const sortOrder = sort && sort.includes('Oldest') ? 1 : -1;

    const query = {
      $and: [
        {
          $or: location
            ? [
                {
                  'current_vacancies.city': { $regex: locationRegex },
                },
                { 'current_vacancies.country': { $regex: location } },
              ]
            : [{}],
        },
        { 'current_vacancies.description': { $regex: keywordsRegex } },
        {
          $and: !jobType
            ? [{}]
            : [{ 'current_vacancies.job_type': { $all: jobType } }],
        },
        {
          $or: [
            {
              $and: [
                { 'current_vacancies.salary': { $exists: false } },
                { 'current_vacancies.salary': { $not: { $type: 'null' } } },
              ],
            },
            {
              'current_vacancies.salary': {
                $gte: minSalary - 1,
                $lte: maxSalary - 1,
              },
            },
          ],
        },
      ],
    };

    const aggregatedData = await this.companiesModel.aggregate([
      { $match: query },
      { $sort: { _id: sortOrder } },
      { $skip: skipAmount },
      { $limit: jobsPerPage },
      { $unwind: '$current_vacancies' },
      {
        $group: {
          _id: '$_id',
          current_vacancies: { $push: '$current_vacancies' },
          avatar: { $first: '$avatar' },
          name: { $first: '$name' },
        },
      },
      { $project: { _id: 1, current_vacancies: 1, avatar: 1, name: 1 } },
    ]);

    const allCurrentVacancies = aggregatedData.flatMap((companyData) => {
      const avatar = companyData.avatar;
      const company = companyData.name;

      return companyData.current_vacancies.map((vac) => ({
        ...vac,
        avatar,
        company,
      }));
    });

    const documentsLength = allCurrentVacancies.length;

    return {
      jobs: allCurrentVacancies,
      documentsLength,
    };
  }

  async getSingleJob(id: string): Promise<object> {
    const company: any = await this.companiesModel
      .findOne({ 'current_vacancies._id': id })
      .exec();
    const plainCompanyObject = company?.toObject();

    const { current_vacancies, ...otherProperties } = plainCompanyObject || {};

    const theOneJob: any = current_vacancies?.find((el: any) => {
      return el._id.toString() === id;
    });

    return {
      ...otherProperties,
      current_vacancy: theOneJob,
    };
  }

  async getLengthInfo(): Promise<{
    vacanciesLength: number;
    freelancersLength: number;
    recentVacancies: any;
  }> {
    // get length of vacancies
    const aggregatedData = await this.companiesModel.aggregate([
      { $match: {} },
      { $unwind: '$current_vacancies' },
      {
        $group: {
          _id: '$_id',
          current_vacancies: { $push: '$current_vacancies' },
        },
      },
      { $project: { _id: 1, current_vacancies: 1 } },
      { $sort: { _id: 1 } },
    ]);

    const allCurrentVacancies = aggregatedData.flatMap((companyData) => {
      return companyData.current_vacancies.map((vac) => ({
        ...vac,
      }));
    });

    const vacanciesLength = allCurrentVacancies.length;

    const recentVacancies = [];
    for (let i = 0; i < 2 && i < vacanciesLength; i++) {
      const el = await allCurrentVacancies[i];
      recentVacancies.push(el);
    }

    // get length of freelancers
    const { documentsLength }: { documentsLength: number } =
      await this.usersService.getUsers({
        location: '',
        keywords: '',
      });

    return {
      vacanciesLength,
      freelancersLength: documentsLength,
      recentVacancies,
    };
  }
}
