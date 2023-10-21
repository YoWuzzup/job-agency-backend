import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

import { CompaniesSchema } from './companies.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UsersSchema } from 'src/users/users.model';
import { AuthSchema } from 'src/auth/auth.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Companies', schema: CompaniesSchema }]),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService, ConfigService, UsersService, JwtService],
  exports: [CompaniesService],
})
export class CompaniesModule {}
