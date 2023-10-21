import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { UsersSchema } from './users.model';
import { AuthSchema } from 'src/auth/auth.model';
import { CompaniesSchema } from 'src/companies/companies.model';
import { CompaniesService } from 'src/companies/companies.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forFeature([{ name: 'Users', schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: 'Auth', schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: 'Companies', schema: CompaniesSchema }]),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, CompaniesService],
})
export class UsersModule {}
