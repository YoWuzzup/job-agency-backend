"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(authModel, usersModel, companiesModel, jwtService, usersService) {
        this.authModel = authModel;
        this.usersModel = usersModel;
        this.companiesModel = companiesModel;
        this.jwtService = jwtService;
        this.usersService = usersService;
    }
    async registration(data, response) {
        const { email, password, confirmPassword } = data;
        const re = /\S+@\S+\.\S+/;
        const user = await this.usersModel.findOne({ email }).exec();
        if (user)
            throw new common_1.ConflictException('User already exists');
        if (!email || !password || !confirmPassword) {
            throw new common_1.ForbiddenException('Invalid Credentials');
        }
        try {
            if (!email.match(re)) {
                throw new common_1.NotAcceptableException('Invalid Email');
            }
            if (password !== confirmPassword) {
                throw new common_1.NotAcceptableException('Passwords are not matched');
            }
            const creatingResult = await this.usersService.createUser(data);
            return await this.login({ email, password }, response);
        }
        catch (error) {
            throw new common_1.NotAcceptableException(error.response);
        }
    }
    async login(data, response) {
        const email = data.email;
        const pass = data.password;
        const _a = await this.validateUser(email, pass), { avatar } = _a, validetedUser = __rest(_a, ["avatar"]);
        const jwt = this.jwtService.sign(validetedUser);
        const { jobs, freelancers } = await this.usersService.getBookmarks({
            bookmarks: validetedUser === null || validetedUser === void 0 ? void 0 : validetedUser.bookmarks,
        });
        response.cookie('access_token', jwt, { httpOnly: true });
        return {
            user: {
                _id: validetedUser._id,
                email: validetedUser.email,
                name: validetedUser.name,
                city: validetedUser.city,
                surname: validetedUser.surname,
                about: validetedUser.about,
                avatar: validetedUser.avatar,
                country: validetedUser.country,
                current_position: validetedUser.current_position,
                experience: validetedUser.experience,
                feedbacks: validetedUser.feedbacks,
                jobs_done: validetedUser.jobs_done,
                attachments: validetedUser.attachments,
                skills: validetedUser.skills,
                starRating: validetedUser.starRating,
                rate: validetedUser.rate,
                previous_positions: validetedUser.previous_positions,
                job_type: validetedUser.job_type,
                bookmarks: { jobs: jobs, freelancers },
                accountType: 'freelancer',
            },
        };
    }
    async googlelogin(data, response) {
        const decoded = this.jwtService.decode(data.credential);
        const user = (await this.usersModel.findOne({ email: decoded.email }).exec()).toJSON();
        let registeredUser;
        if (!user) {
            registeredUser = await this.usersService.createGoogleUser(decoded);
        }
        const userFullInfo = Object.assign(Object.assign(Object.assign({}, decoded), user), registeredUser);
        const { exp, avatar } = userFullInfo, restInfo = __rest(userFullInfo, ["exp", "avatar"]);
        const { jobs, freelancers } = await this.usersService.getBookmarks({
            bookmarks: userFullInfo === null || userFullInfo === void 0 ? void 0 : userFullInfo.bookmarks,
        });
        const jwt = this.jwtService.sign(restInfo, { expiresIn: exp });
        response.cookie('access_token', jwt, { httpOnly: true });
        return {
            user: {
                _id: userFullInfo._id,
                email: userFullInfo.email,
                name: userFullInfo.name,
                city: userFullInfo.city,
                surname: userFullInfo.surname,
                about: userFullInfo.about,
                avatar: userFullInfo.avatar,
                country: userFullInfo.country,
                current_position: userFullInfo.current_position,
                experience: userFullInfo.experience,
                feedbacks: userFullInfo.feedbacks,
                jobs_done: userFullInfo.jobs_done,
                attachments: userFullInfo.attachments,
                skills: userFullInfo.skills,
                starRating: userFullInfo.starRating,
                rate: userFullInfo.rate,
                previous_positions: userFullInfo.previous_positions,
                job_type: userFullInfo.job_type,
                bookmarks: { jobs, freelancers },
                accountType: 'freelancer',
            },
        };
    }
    async validateUser(email, pass) {
        const user = (await this.usersService.findUser(email)).toObject();
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password } = user, result = __rest(user, ["password"]);
            return Object.assign({}, result);
        }
        throw new common_1.HttpException({
            statusCode: common_1.HttpStatus.NOT_FOUND,
            message: 'Wrong credentials',
            error: 'Not found',
        }, common_1.HttpStatus.NOT_FOUND);
    }
    async signout(data, res) {
        const jwt = this.jwtService.sign({ data }, {
            expiresIn: -1,
        });
        res.cookie('access_token', jwt, { httpOnly: true });
        return new common_1.HttpException({
            statusCode: common_1.HttpStatus.OK,
            message: 'User logged out successfully',
            success: true,
        }, common_1.HttpStatus.OK);
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Auth')),
    __param(1, (0, mongoose_1.InjectModel)('Users')),
    __param(2, (0, mongoose_1.InjectModel)('Companies')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        jwt_1.JwtService,
        users_service_1.UsersService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map