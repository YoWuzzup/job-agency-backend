export declare class AuthDataDto {
    email: string;
    password: string;
    access_token: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class GoogleLoginDto {
    credential: string;
    clientId: string;
    select_by: string;
}
export declare class RegistrationDto extends LoginDto {
    confirmPassword: string;
    accountType: 'freelancer' | 'employer';
}
