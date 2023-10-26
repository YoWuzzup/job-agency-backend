import * as mongoose from 'mongoose';
export declare const UsersSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    experience: any[];
    job_type: any[];
    jobs_done: any[];
    skills: any[];
    starRating: any[];
    name: string;
    city: string;
    surname: string;
    about: string;
    avatar: string;
    country: string;
    previous_positions: {
        position?: string;
        start_date?: Date;
        rating?: number;
        description?: string;
        company_name?: string;
        end_date?: Date;
    }[];
    feedbacks: {
        rating?: number;
        employer?: string;
        success?: boolean;
        will_recommend?: boolean;
        on_time?: boolean;
        on_budget?: boolean;
    }[];
    email?: string;
    age?: number;
    rate?: number;
    verified?: boolean;
    attachments?: any;
    password?: string;
    current_position?: {
        default?: any;
        position?: string;
        start_date?: Date;
        rating?: number;
        description?: string;
        company_name?: string;
        company_logo?: string;
    };
    bookmarks?: {
        jobs: any[];
        freelancers: any[];
    };
    subscriptions?: any;
}>;
export interface Users extends mongoose.Document {
    email: string;
    password: string;
    name: string;
    city: string;
    age: number;
    about: string;
    avatar: string;
    country: string;
    experience: Array<object>;
    hourly_rate: number;
    jobs_done: Array<object>;
    surname: string;
    verified: boolean;
    attachments: object;
    skills: Array<string>;
    current_position: {
        position: string;
        start_date: Date;
        rating: number;
        description: string;
        company_name: string;
        company_logo: string;
    };
    previous_positions: [
        {
            position: string;
            start_date: Date;
            end_date: Date;
            rating: number;
            description: string;
            company_name: string;
        }
    ];
    feedbacks: [
        {
            employer: string;
            success: boolean;
            will_recommend: boolean;
            on_time: boolean;
            on_budget: boolean;
            rating: number;
        }
    ];
    job_type: string[];
    rate: number;
    starRating: Array<number>;
    bookmarks: {
        jobs: string[];
        freelancers: string[];
    };
    subscriptions: Record<string, unknown>;
}
