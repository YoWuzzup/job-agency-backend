import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Req } from '@nestjs/common/decorators';
import { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { AuthService } from './auth.service';

import { RegistrationDto, LoginDto, GoogleLoginDto } from './authData.dto';

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('registration')
  async registration(
    @Body() regData: RegistrationDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.registration(regData, response);
  }

  @Post('login')
  async loging(
    @Body() loginData: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    return this.authService.login(loginData, response);
  }

  @Post('google')
  async googlelogin(
    @Body() data: GoogleLoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<object> {
    return this.authService.googlelogin(data, response);
  }

  @Post('signout')
  async logout(
    @Body() data: any,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.signout(data, response);
  }

  @Get('test')
  async test(@Req() req) {
    return `test controller is working`;
  }
}
