export class AuthDataDto {
  email: string;
  password: string;
  access_token: string;
}

export class LoginDto {
  email: string;
  password: string;
}

export class GoogleLoginDto {
  credential: string;
  clientId: string;
  select_by: string;
}

export class RegistrationDto extends LoginDto {
  confirmPassword: string;
  accountType: 'freelancer' | 'employer';
}
