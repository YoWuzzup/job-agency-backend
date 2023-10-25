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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const mongodb_1 = require("mongodb");
let UsersService = class UsersService {
    constructor(jwtService, usersModel, authModel, companiesModel) {
        this.jwtService = jwtService;
        this.usersModel = usersModel;
        this.authModel = authModel;
        this.companiesModel = companiesModel;
    }
    async getUsers(filter) {
        const { location, keywords, salary, jobType, sort, page } = filter;
        const locationRegex = new RegExp(location, 'i');
        const keywordsRegex = new RegExp(keywords, 'i');
        const [minSalary, maxSalary] = salary || [0, 5000];
        const usersPerPage = 10;
        const skipAmount = (page - 1) * usersPerPage;
        const sortOrder = sort && sort.includes('Oldest') ? 1 : -1;
        const query = {
            $and: [
                {
                    $or: [
                        {
                            city: { $regex: locationRegex },
                        },
                        { country: { $regex: locationRegex } },
                    ],
                },
                { about: { $regex: keywordsRegex } },
                {
                    $and: !jobType ? [{}] : [{ job_type: { $all: jobType } }],
                },
                {
                    $or: [
                        { rate: { $exists: false } },
                        { rate: { $gte: minSalary, $lte: maxSalary } },
                    ],
                },
            ],
        };
        const users = await this.usersModel
            .find(query)
            .sort({ _id: sortOrder })
            .skip(skipAmount)
            .limit(usersPerPage)
            .exec();
        const documentsLength = await this.usersModel.find(query).countDocuments();
        return { users, documentsLength };
    }
    async getSingleFreelancer(id) {
        const freelancer = await this.usersModel.find({ _id: id }).exec();
        return Object.assign({}, freelancer);
    }
    async createUser(userData) {
        const hashedPass = await bcrypt.hash(userData.password, 12);
        const { confirmPassword } = userData, restOfUserData = __rest(userData, ["confirmPassword"]);
        const newUser = new this.usersModel(Object.assign(Object.assign({}, restOfUserData), { password: hashedPass }));
        const saving = await newUser.save();
        const { password } = saving, result = __rest(saving, ["password"]);
        return result;
    }
    async createGoogleUser(userData) {
        const newUser = new this.usersModel(Object.assign({}, userData));
        return await newUser.save();
    }
    async findUser(email) {
        let user;
        try {
            user = await this.usersModel.findOne({ email }).exec();
        }
        catch (error) {
            throw new common_1.NotFoundException('Could not find the user');
        }
        if (!user)
            throw new common_1.NotFoundException('Could not find the user');
        return user;
    }
    async changeUserData(id, data) {
        const parsedData = data.data ? JSON.parse(data.data) : data;
        const updatedUser = (await this.usersModel
            .findOneAndUpdate({ _id: id }, { $set: Object.assign({}, parsedData) }, { new: true })
            .exec()).toJSON();
        const { password } = updatedUser, user = __rest(updatedUser, ["password"]);
        return Object.assign({}, user);
    }
    async subscribeUser(data, type) {
        const user = (await this.usersModel
            .findOneAndUpdate({
            $or: [{ _id: data.id }, { email: data.email }],
        }, {
            $set: {
                [`subscriptions.${type}`]: {
                    value: data.value,
                    query: data.alertsQuery || null,
                },
            },
        }, { new: true })
            .exec()).toJSON();
        if (!user)
            throw new common_1.NotFoundException('Could not find the user');
        const { password } = user, updatedUser = __rest(user, ["password"]);
        return Object.assign({}, updatedUser);
    }
    async getBookmarks({ bookmarks, userId, }) {
        if (!bookmarks) {
            const user = await this.usersModel.findOne({ _id: userId });
            bookmarks = user === null || user === void 0 ? void 0 : user.bookmarks;
        }
        const { jobs, freelancers } = bookmarks;
        const jobIds = jobs === null || jobs === void 0 ? void 0 : jobs.map((id) => new mongodb_1.ObjectId(id));
        const freelancersIds = freelancers === null || freelancers === void 0 ? void 0 : freelancers.map((id) => new mongodb_1.ObjectId(id));
        const aggregatedJobData = await this.companiesModel.aggregate([
            {
                $match: {
                    'current_vacancies._id': {
                        $in: jobIds,
                    },
                },
            },
            { $sort: { 'current_vacancies._id': 1 } },
            { $unwind: '$current_vacancies' },
            {
                $group: {
                    _id: '$_id',
                    current_vacancies: { $push: '$current_vacancies' },
                    avatar: { $first: '$avatar' },
                    name: { $first: '$name' },
                },
            },
            {
                $project: {
                    _id: 1,
                    current_vacancies: 1,
                    avatar: 1,
                    name: 1,
                },
            },
        ]);
        const allCurrentVacancies = aggregatedJobData.flatMap((companyData) => {
            const avatar = companyData.avatar;
            const company = companyData.name;
            return companyData.current_vacancies.map((vac) => (Object.assign(Object.assign({}, vac), { avatar,
                company })));
        });
        const freelancerData = await this.usersModel.find({
            _id: { $in: freelancersIds },
        });
        const flWithNoPass = freelancerData.map((doc) => {
            const _a = doc.toJSON(), { password } = _a, rest = __rest(_a, ["password"]);
            return rest;
        });
        return { jobs: allCurrentVacancies, freelancers: flWithNoPass };
    }
    async deleteBookmarks(data) {
        const { itemId, userEmail, type, userId } = data;
        const user = (await this.usersModel.findOneAndUpdate({ $or: [{ email: userEmail }, { _id: userId }] }, { $pull: { [`bookmarks.${type}`]: itemId } }, { new: true })).toJSON();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { jobs, freelancers } = await this.getBookmarks({
            bookmarks: user === null || user === void 0 ? void 0 : user.bookmarks,
            userId,
        });
        return Object.assign(Object.assign({}, user), { bookmarks: { jobs: jobs || [], freelancers: freelancers || [] } });
    }
    async addBookmarks(data) {
        const { itemId, userEmail, type, userId } = data;
        const user = (await this.usersModel
            .findOneAndUpdate({ $or: [{ email: userEmail }, { _id: userId }] }, { $addToSet: { [`bookmarks.${type}`]: itemId } }, { new: true })
            .exec()).toJSON();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { jobs, freelancers } = await this.getBookmarks({
            bookmarks: user === null || user === void 0 ? void 0 : user.bookmarks,
        });
        const { password } = user, fullUser = __rest(user, ["password"]);
        return Object.assign(Object.assign({}, fullUser), { bookmarks: { jobs, freelancers } });
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Users')),
    __param(2, (0, mongoose_1.InjectModel)('Auth')),
    __param(3, (0, mongoose_1.InjectModel)('Companies')),
    __metadata("design:paramtypes", [jwt_1.JwtService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map