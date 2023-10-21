export class CompanyDataDto {
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
