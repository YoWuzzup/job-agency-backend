import * as mongoose from 'mongoose';
export declare const CompaniesSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    city: string;
    feedbacks: {
        date?: Date;
        rating?: number;
        reviewer_name?: string;
        comment?: string;
        isAnonymous?: boolean;
    }[];
    star_rating: any[];
    current_vacancies: {
        job_type: any[];
        feedbacks: {
            date?: Date;
            rating?: number;
            reviewer_name?: string;
            comment?: string;
            isAnonymous?: boolean;
        }[];
        salary: any[];
        city?: string;
        position?: string;
        description?: string;
        posted?: Date;
    }[];
    email?: string;
    about?: string;
    avatar?: string;
    country?: string;
    is_verified?: boolean;
    address?: string;
}>;
export interface Companies extends mongoose.Document {
    email: string;
    name: {
        type: string;
        default: '';
    };
    city: {
        type: string;
        default: '';
    };
    avatar: string;
    country: string;
    about: string;
    is_verified: boolean;
    star_rating: Array<number>;
    address: string;
    current_vacancies: [
        {
            position: string;
            description: string;
            salary: Array<number>;
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
        }
    ];
    feedbacks: [
        {
            reviewer_name: string;
            rating: number;
            date: Date;
            comment: string;
            isAnonymous: boolean;
        }
    ];
}
