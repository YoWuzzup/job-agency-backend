"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSchema = void 0;
const mongoose = require("mongoose");
exports.AuthSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: Number,
    appointments: Array,
    confirmed: {
        type: Boolean,
        default: false,
    },
    message: { type: String, default: '' },
    password: { type: String, default: '' },
});
//# sourceMappingURL=auth.model.js.map