"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesSchema = void 0;
const mongoose = require("mongoose");
exports.CompaniesSchema = new mongoose.Schema({
    email: String,
    name: { type: String, default: '' },
    city: { type: String, default: '' },
    avatar: String,
    country: String,
    about: String,
    is_verified: Boolean,
    star_rating: Array,
    address: String,
    current_vacancies: [
        {
            position: String,
            description: String,
            salary: Array,
            job_type: Array,
            posted: Date,
            city: String,
            feedbacks: [
                {
                    reviewer_name: String,
                    rating: Number,
                    date: Date,
                    comment: String,
                    isAnonymous: Boolean,
                },
            ],
        },
    ],
    feedbacks: [
        {
            reviewer_name: String,
            rating: Number,
            date: Date,
            comment: String,
            isAnonymous: Boolean,
        },
    ],
});
//# sourceMappingURL=companies.model.js.map