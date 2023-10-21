import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  email: String,
  name: { type: String, default: '' },
  city: { type: String, default: '' },
  surname: { type: String, default: '' },
  age: Number,
  about: { type: String, default: '' },
  avatar: { type: String, default: '' },
  country: { type: String, default: '' },
  current_position: {
    position: String,
    start_date: Date,
    rating: Number,
    description: String,
    company_name: String,
    company_logo: String,
    default: {},
  },
  previous_positions: [
    {
      position: String,
      start_date: Date,
      end_date: Date,
      rating: Number,
      description: String,
      company_name: String,
    },
  ],
  experience: Array,
  feedbacks: [
    {
      employer: String,
      success: Boolean,
      will_recommend: Boolean,
      on_time: Boolean,
      on_budget: Boolean,
      rating: Number,
    },
  ],
  job_type: Array,
  rate: Number,
  jobs_done: Array,
  verified: Boolean,
  attachments: Object,
  skills: Array,
  password: String,
  starRating: Array,
  bookmarks: { jobs: Array<string>, freelancers: Array<string> },
  subscriptions: {},
});

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
    },
  ];
  feedbacks: [
    {
      employer: string;
      success: boolean;
      will_recommend: boolean;
      on_time: boolean;
      on_budget: boolean;
      rating: number;
    },
  ];
  job_type: string[];
  rate: number;
  starRating: Array<number>;
  bookmarks: { jobs: string[]; freelancers: string[] };
  subscriptions: Record<string, unknown>;
}
