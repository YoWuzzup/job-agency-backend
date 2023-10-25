"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const users_model_1 = require("./users.model");
const auth_model_1 = require("../auth/auth.model");
const companies_model_1 = require("../companies/companies.model");
const companies_service_1 = require("../companies/companies.service");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            mongoose_1.MongooseModule.forFeature([{ name: 'Users', schema: users_model_1.UsersSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Auth', schema: auth_model_1.AuthSchema }]),
            mongoose_1.MongooseModule.forFeature([{ name: 'Companies', schema: companies_model_1.CompaniesSchema }]),
            jwt_1.JwtModule.register({
                secret: `${process.env.JWT_SECRET}`,
                signOptions: { expiresIn: '1d' },
            }),
        ],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService, config_1.ConfigService, companies_service_1.CompaniesService],
    })
], UsersModule);
exports.UsersModule = UsersModule;
//# sourceMappingURL=users.module.js.map