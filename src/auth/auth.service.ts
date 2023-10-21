import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Response } from 'express';

import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.model';
import { Auth } from './auth.model';
import { Companies } from 'src/companies/companies.model';
import { GoogleLoginDto, LoginDto, RegistrationDto } from './authData.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    @InjectModel('Users') private readonly usersModel: Model<Users>,
    @InjectModel('Companies') private readonly companiesModel: Model<Companies>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async registration(data: RegistrationDto, response: Response) {
    const { email, password, confirmPassword } = data;
    const re = /\S+@\S+\.\S+/;
    // usersService already has checking if !user
    const user = await this.usersModel.findOne({ email }).exec();

    if (user) throw new ConflictException('User already exists');

    if (!email || !password || !confirmPassword) {
      throw new ForbiddenException('Invalid Credentials');
    }

    // if no user in DB
    try {
      if (!email.match(re)) {
        throw new NotAcceptableException('Invalid Email');
      }

      if (password !== confirmPassword) {
        throw new NotAcceptableException('Passwords are not matched');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const creatingResult = await this.usersService.createUser(data);

      return await this.login({ email, password }, response);
    } catch (error) {
      throw new NotAcceptableException(error.response);
    }
  }

  async login(data: LoginDto, response: Response): Promise<object> {
    const email = data.email;
    const pass = data.password;

    // finding and validating and get rid of avatar
    const { avatar, ...validetedUser } = await this.validateUser(email, pass);
    const jwt = this.jwtService.sign(validetedUser);
    const { jobs, freelancers } = await this.usersService.getBookmarks({
      bookmarks: validetedUser?.bookmarks,
    });

    response.cookie('access_token', jwt, { httpOnly: true });
    return {
      user: {
        _id: validetedUser._id,
        email: validetedUser.email,
        name: validetedUser.name,
        city: validetedUser.city,
        surname: validetedUser.surname,
        about: validetedUser.about,
        avatar: validetedUser.avatar,
        country: validetedUser.country,
        current_position: validetedUser.current_position,
        experience: validetedUser.experience,
        feedbacks: validetedUser.feedbacks,
        jobs_done: validetedUser.jobs_done,
        attachments: validetedUser.attachments,
        skills: validetedUser.skills,
        starRating: validetedUser.starRating,
        rate: validetedUser.rate,
        previous_positions: validetedUser.previous_positions,
        job_type: validetedUser.job_type,
        bookmarks: { jobs: jobs, freelancers },
        accountType: 'freelancer',
      },
    };
  }

  async googlelogin(data: GoogleLoginDto, response: Response): Promise<object> {
    const decoded: any = this.jwtService.decode(data.credential);
    // toJSON() to get rid of _doc properties at ... spread part
    const user = (
      await this.usersModel.findOne({ email: decoded.email }).exec()
    ).toJSON();
    let registeredUser: any;

    if (!user) {
      registeredUser = await this.usersService.createGoogleUser(decoded);
    }

    const userFullInfo = { ...decoded, ...user, ...registeredUser };
    // get rid from avatar in cookies 'cuz it's too big
    const { exp, avatar, ...restInfo } = userFullInfo;
    const { jobs, freelancers } = await this.usersService.getBookmarks({
      bookmarks: userFullInfo?.bookmarks,
    });

    const jwt = this.jwtService.sign(restInfo, { expiresIn: exp });
    response.cookie('access_token', jwt, { httpOnly: true });
    return {
      user: {
        _id: userFullInfo._id,
        email: userFullInfo.email,
        name: userFullInfo.name,
        city: userFullInfo.city,
        surname: userFullInfo.surname,
        about: userFullInfo.about,
        avatar: userFullInfo.avatar,
        country: userFullInfo.country,
        current_position: userFullInfo.current_position,
        experience: userFullInfo.experience,
        feedbacks: userFullInfo.feedbacks,
        jobs_done: userFullInfo.jobs_done,
        attachments: userFullInfo.attachments,
        skills: userFullInfo.skills,
        starRating: userFullInfo.starRating,
        rate: userFullInfo.rate,
        previous_positions: userFullInfo.previous_positions,
        job_type: userFullInfo.job_type,
        bookmarks: { jobs, freelancers },
        accountType: 'freelancer',
      },
    };
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = (await this.usersService.findUser(email)).toObject();
    if (user && (await bcrypt.compare(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return { ...result };
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Wrong credentials',
        error: 'Not found',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async signout(data: any, res: Response): Promise<object> {
    const jwt = this.jwtService.sign(
      { data },
      {
        expiresIn: -1,
      },
    );

    res.cookie('access_token', jwt, { httpOnly: true });

    return new HttpException(
      {
        statusCode: HttpStatus.OK,
        message: 'User logged out successfully',
        success: true,
      },
      HttpStatus.OK,
    );
  }
}
