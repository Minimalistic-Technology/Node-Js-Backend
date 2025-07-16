"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const courseSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    createdAt: { type: Date, default: Date.now }
});
exports.default = (0, mongoose_1.model)('Course', courseSchema);
