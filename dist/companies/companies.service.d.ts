import { Model } from 'mongoose';
import { Companies } from './companies.model';
import { UsersService } from 'src/users/users.service';
export declare class CompaniesService {
    private usersService;
    private readonly companiesModel;
    constructor(usersService: UsersService, companiesModel: Model<Companies>);
    getCompanies(filter: {
        location: string;
        keywords: string;
        salary: number[];
        jobType: string[];
        sort: string[];
        page: number;
    }): Promise<{
        companies: Companies[];
        documentsLength: number;
    }>;
    getJobs(filter: {
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
                }
            ];
        }[];
        documentsLength: number;
    }>;
    getSingleJob(id: string): Promise<object>;
    getLengthInfo(): Promise<{
        vacanciesLength: number;
        freelancersLength: number;
        recentVacancies: any;
    }>;
}
