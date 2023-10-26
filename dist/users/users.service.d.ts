import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Users } from './users.model';
import { Auth } from 'src/auth/auth.model';
import { ObjectId } from 'mongodb';
import { Companies } from 'src/companies/companies.model';
export declare class UsersService {
    private jwtService;
    private readonly usersModel;
    private readonly authModel;
    private readonly companiesModel;
    constructor(jwtService: JwtService, usersModel: Model<Users>, authModel: Model<Auth>, companiesModel: Model<Companies>);
    getUsers(filter: {
        location: string;
        keywords: string;
        salary?: number[];
        jobType?: string[];
        sort?: string[];
        page?: number;
    }): Promise<{
        users: Users[];
        documentsLength: number;
    }>;
    getSingleFreelancer(id: string): Promise<object>;
    createUser(userData: {
        email: string;
        password: string;
        confirmPassword: string;
        accountType: string;
    }): Promise<object>;
    createGoogleUser(userData: any): Promise<object>;
    findUser(email: string): Promise<Users>;
    changeUserData(id: string, data: any): Promise<object>;
    subscribeUser(data: any, type: string): Promise<{
        [x: string]: any;
        [x: number]: any;
        [x: symbol]: any;
    }>;
    getBookmarks({ bookmarks, userId, }: {
        bookmarks?: {
            jobs?: string[] | ObjectId[];
            freelancers?: string[] | ObjectId[];
        };
        userId?: string | ObjectId;
    }): Promise<{
        jobs: any;
        freelancers: any;
    }>;
    deleteBookmarks(data: {
        userId: string | ObjectId;
        itemId: string | ObjectId;
        userEmail: string;
        type: 'jobs' | 'freelancers';
    }): Promise<{
        bookmarks: {
            jobs: any;
            freelancers: any;
        };
    }>;
    addBookmarks(data: {
        userId: string | ObjectId;
        itemId: string | ObjectId;
        userEmail: string;
        type: 'jobs' | 'freelancers';
    }): Promise<{
        bookmarks: {
            jobs: any;
            freelancers: any;
        };
    }>;
}
