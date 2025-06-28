"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const projectSchema = new mongoose_1.Schema({
    image: { type: String, required: true },
    name: { type: String, required: true },
    git: { type: String, required: true },
    live: { type: String, required: true },
    category: {
        type: String,
        enum: ['Website Design', 'App Mobile Design', 'App Desktop', 'Branding'],
        required: true,
    },
});
exports.default = (0, mongoose_1.model)('Project', projectSchema);
