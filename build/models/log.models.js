"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const apiLogSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: null },
    method: { type: String, required: true },
    endpoint: { type: String, required: true },
    requestPayload: { type: Object, default: {} },
    responsePayload: { type: Object, default: null },
    statusCode: { type: Number },
    duration: { type: Number },
    timestamp: { type: Date, default: Date.now },
    userAgent: { type: String },
    ip: { type: String },
});
const LogModel = mongoose_1.default.model('Log', apiLogSchema);
exports.default = LogModel;
