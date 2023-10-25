import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegistrationDto, LoginDto, GoogleLoginDto } from './authData.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    registration(regData: RegistrationDto, response: Response): Promise<object>;
    loging(loginData: LoginDto, response: Response): Promise<object>;
    googlelogin(data: GoogleLoginDto, response: Response): Promise<object>;
    logout(data: any, response: Response): Promise<object>;
    test(req: any): Promise<string>;
}
