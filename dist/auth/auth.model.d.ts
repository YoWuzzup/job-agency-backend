import * as mongoose from 'mongoose';
export declare const AuthSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    email: string;
    password: string;
    name: string;
    appointments: any[];
    confirmed: boolean;
    message: string;
    phone?: number;
}>;
export interface Auth extends mongoose.Document {
    email: {
        type: string;
        default: '';
    };
    password?: {
        type: string;
        default: '';
    };
    name?: {
        type: string;
        default: '';
    };
    phone?: number;
    appointments?: Array<object>;
    confirmed?: boolean;
    message?: {
        type: string;
        default: '';
    };
}
