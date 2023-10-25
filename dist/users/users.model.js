"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSchema = void 0;
const mongoose = require("mongoose");
exports.UsersSchema = new mongoose.Schema({
    email: String,
    name: { type: String, default: '' },
    city: { type: String, default: '' },
    surname: { type: String, default: '' },
    age: Number,
    about: { type: String, default: '' },
    avatar: { type: String, default: '' },
    country: { type: String, default: '' },
    current_position: {
        position: String,
        start_date: Date,
        rating: Number,
        description: String,
        company_name: String,
        company_logo: String,
        default: {},
    },
    previous_positions: [
        {
            position: String,
            start_date: Date,
            end_date: Date,
            rating: Number,
            description: String,
            company_name: String,
        },
    ],
    experience: Array,
    feedbacks: [
        {
            employer: String,
            success: Boolean,
            will_recommend: Boolean,
            on_time: Boolean,
            on_budget: Boolean,
            rating: Number,
        },
    ],
    job_type: Array,
    rate: Number,
    jobs_done: Array,
    verified: Boolean,
    attachments: Object,
    skills: Array,
    password: String,
    starRating: Array,
    bookmarks: { jobs: (Array), freelancers: (Array) },
    subscriptions: {},
});
//# sourceMappingURL=users.model.js.map