"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const profileSchema = new mongoose.Schema({
    doj: { type: Date, required: false },
    panCard: { type: String, required: false },
    adharCard: { type: String, required: false },
    designation: { type: String, required: false },
    income: { type: String, required: false }
});
exports.default = mongoose_1.model('profileDetail', profileSchema);
