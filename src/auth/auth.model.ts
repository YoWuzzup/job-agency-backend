import * as mongoose from 'mongoose';

export const AuthSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: Number,
  appointments: Array,
  confirmed: {
    type: Boolean,
    default: false,
  },
  message: { type: String, default: '' },
  password: { type: String, default: '' },
});

export interface Auth extends mongoose.Document {
  email: { type: string; default: '' };
  password?: { type: string; default: '' };
  name?: { type: string; default: '' };
  phone?: number;
  appointments?: Array<object>;
  confirmed?: boolean;
  message?: { type: string; default: '' };
}
