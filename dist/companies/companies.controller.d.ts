import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private companiesService;
    constructor(companiesService: CompaniesService);
    getCompanies(filter: any): Promise<{
        companies: import("./companies.model").Companies[];
        documentsLength: number;
    }>;
    getAllJobs(filter: any): Promise<{
        jobs: {
            avatar: string;
            position: string;
            description: string;
            salary: number[];
            job_type: string[];
            posted: Date;
            city: string;
            feedbacks: [{
                reviewer_name: string;
                rating: number;
                date: Date;
                comment: string;
                isAnonymous: boolean;
            }];
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
