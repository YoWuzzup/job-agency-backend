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
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const users_service_1 = require("../users/users.service");
let CompaniesService = class CompaniesService {
    constructor(usersService, companiesModel) {
        this.usersService = usersService;
        this.companiesModel = companiesModel;
    }
    async getCompanies(filter) {
        const { location, keywords, salary, jobType, sort, page } = filter;
        const companiesPerPage = 10;
        const skipAmount = (page - 1) * companiesPerPage;
        const sortOrder = sort.includes('Oldest') ? 1 : -1;
        const query = {};
        const companies = await this.companiesModel
            .find(query)
            .sort({ _id: sortOrder })
            .skip(skipAmount)
            .limit(companiesPerPage)
            .exec();
        const documentsLength = await this.companiesModel
            .find(query)
            .countDocuments();
        return {
            companies,
            documentsLength,
        };
    }
    async getJobs(filter) {
        const { location, keywords, salary, jobType, sort, page } = filter;
        const locationRegex = new RegExp(location, 'i');
        const keywordsRegex = new RegExp(keywords, 'i');
        const [minSalary, maxSalary] = salary;
        const jobsPerPage = 10;
        const skipAmount = (page - 1) * jobsPerPage;
        const sortOrder = sort && sort.includes('Oldest') ? 1 : -1;
        const query = {
            $and: [
                {
                    $or: location
                        ? [
                            {
                                'current_vacancies.city': { $regex: locationRegex },
                            },
                            { 'current_vacancies.country': { $regex: location } },
                        ]
                        : [{}],
                },
                { 'current_vacancies.description': { $regex: keywordsRegex } },
                {
                    $and: !jobType
                        ? [{}]
                        : [{ 'current_vacancies.job_type': { $all: jobType } }],
                },
                {
                    $or: [
                        {
                            $and: [
                                { 'current_vacancies.salary': { $exists: false } },
                                { 'current_vacancies.salary': { $not: { $type: 'null' } } },
                            ],
                        },
                        {
                            'current_vacancies.salary': {
                                $gte: minSalary - 1,
                                $lte: maxSalary - 1,
                            },
                        },
                    ],
                },
            ],
        };
        const aggregatedData = await this.companiesModel.aggregate([
            { $match: query },
            { $sort: { _id: sortOrder } },
            { $skip: skipAmount },
            { $limit: jobsPerPage },
            { $unwind: '$current_vacancies' },
            {
                $group: {
                    _id: '$_id',
                    current_vacancies: { $push: '$current_vacancies' },
                    avatar: { $first: '$avatar' },
                    name: { $first: '$name' },
                },
            },
            { $project: { _id: 1, current_vacancies: 1, avatar: 1, name: 1 } },
        ]);
        const allCurrentVacancies = aggregatedData.flatMap((companyData) => {
            const avatar = companyData.avatar;
            const company = companyData.name;
            return companyData.current_vacancies.map((vac) => (Object.assign(Object.assign({}, vac), { avatar,
                company })));
        });
        const documentsLength = allCurrentVacancies.length;
        return {
            jobs: allCurrentVacancies,
            documentsLength,
        };
    }
    async getSingleJob(id) {
        const company = await this.companiesModel
            .findOne({ 'current_vacancies._id': id })
            .exec();
        const plainCompanyObject = company === null || company === void 0 ? void 0 : company.toObject();
        const _a = plainCompanyObject || {}, { current_vacancies } = _a, otherProperties = __rest(_a, ["current_vacancies"]);
        const theOneJob = current_vacancies === null || current_vacancies === void 0 ? void 0 : current_vacancies.find((el) => {
            return el._id.toString() === id;
        });
        return Object.assign(Object.assign({}, otherProperties), { current_vacancy: theOneJob });
    }
    async getLengthInfo() {
        const aggregatedData = await this.companiesModel.aggregate([
            { $match: {} },
            { $unwind: '$current_vacancies' },
            {
                $group: {
                    _id: '$_id',
                    current_vacancies: { $push: '$current_vacancies' },
                },
            },
            { $project: { _id: 1, current_vacancies: 1 } },
            { $sort: { _id: 1 } },
        ]);
        const allCurrentVacancies = aggregatedData.flatMap((companyData) => {
            return companyData.current_vacancies.map((vac) => (Object.assign({}, vac)));
        });
        const vacanciesLength = allCurrentVacancies.length;
        const recentVacancies = [];
        for (let i = 0; i < 2 && i < vacanciesLength; i++) {
            const el = await allCurrentVacancies[i];
            recentVacancies.push(el);
        }
        const { documentsLength } = await this.usersService.getUsers({
            location: '',
            keywords: '',
        });
        return {
            vacanciesLength,
            freelancersLength: documentsLength,
            recentVacancies,
        };
    }
};
CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)('Companies')),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        mongoose_2.Model])
], CompaniesService);
exports.CompaniesService = CompaniesService;
//# sourceMappingURL=companies.service.js.map