"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'superAdmin', 'employee', 'HR'], required: true },
    dob: { type: Date, required: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    profile_pic_url: { type: String, required: false },
    address: [{ type: mongoose.Types.ObjectId, ref: 'address' }],
    verified: { type: Boolean, required: true },
    verification_token: { type: Number, required: true },
    verification_token_time: { type: Date, required: true },
    reset_password_token: { type: Number, required: false },
    reset_password_token_time: { type: Date, required: false },
    userDetails: { type: mongoose.Types.ObjectId, ref: 'profileDetail' }
});
exports.default = mongoose_1.model('user', userSchema);
