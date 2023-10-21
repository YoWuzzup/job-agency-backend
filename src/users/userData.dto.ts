export class UserDataDto {
  id: string;
  name: string;
  city: string;
  age: number;
  about: string;
  avatar: string;
  country: string;
  current_position: string;
  experience: Array<object>;
  feedbacks: Array<object>;
  hourly_rate: number;
  jobs_done: Array<object>;
  job_type: Array<string>;
  surname: string;
  verified: boolean;
  attachments: object;
  skills: Array<string>;
  bookmarks: { jobs: string[]; freelancers: string[] };
}
