import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { Users } from 'src/users/users.model';
import { Auth } from './auth.model';
import { Companies } from 'src/companies/companies.model';
import { GoogleLoginDto, LoginDto, RegistrationDto } from './authData.dto';
export declare class AuthService {
    private readonly authModel;
    private readonly usersModel;
    private readonly companiesModel;
    private jwtService;
    private usersService;
    constructor(authModel: Model<Auth>, usersModel: Model<Users>, companiesModel: Model<Companies>, jwtService: JwtService, usersService: UsersService);
    registration(data: RegistrationDto, response: Response): Promise<object>;
    login(data: LoginDto, response: Response): Promise<object>;
    googlelogin(data: GoogleLoginDto, response: Response): Promise<object>;
    validateUser(email: string, pass: string): Promise<any>;
    signout(data: any, res: Response): Promise<object>;
}
