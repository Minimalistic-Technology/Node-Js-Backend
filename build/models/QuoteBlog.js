"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const quoteBlogSchema = new mongoose_1.Schema({
    quote: { type: String, required: true },
    name: { type: String, required: true },
    title: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});
exports.default = (0, mongoose_1.model)('QuoteBlog', quoteBlogSchema);
