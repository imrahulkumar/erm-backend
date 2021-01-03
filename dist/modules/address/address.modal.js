"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
const addressSchema = new mongoose.Schema({
    location: { type: String, required: true },
    updated_at: { type: Date, required: true },
    created_at: { type: Date, required: true }
});
exports.default = mongoose_1.model('address', addressSchema);
