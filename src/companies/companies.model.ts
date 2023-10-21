import * as mongoose from 'mongoose';

export const CompaniesSchema = new mongoose.Schema({
  email: String,
  name: { type: String, default: '' },
  city: { type: String, default: '' },
  avatar: String,
  country: String,
  about: String,
  is_verified: Boolean,
  star_rating: Array,
  address: String,
  current_vacancies: [
    {
      position: String,
      description: String,
      salary: Array,
      job_type: Array,
      posted: Date,
      city: String,
      feedbacks: [
        {
          reviewer_name: String,
          rating: Number,
          date: Date,
          comment: String,
          isAnonymous: Boolean,
        },
      ],
    },
  ],
  feedbacks: [
    {
      reviewer_name: String,
      rating: Number,
      date: Date,
      comment: String,
      isAnonymous: Boolean,
    },
  ],
});

export interface Companies extends mongoose.Document {
  email: string;
  name: { type: string; default: '' };
  city: { type: string; default: '' };
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
        },
      ];
    },
  ];
  feedbacks: [
    {
      reviewer_name: string;
      rating: number;
      date: Date;
      comment: string;
      isAnonymous: boolean;
    },
  ];
}
