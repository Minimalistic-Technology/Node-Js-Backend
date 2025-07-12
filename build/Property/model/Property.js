"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    title: String,
    location: String,
    originalPrice: Number,
    discountedPrice: Number,
    area: Number,
    type: String,
    bedrooms: Number,
    availability: String,
    image: String,
});
exports.default = mongoose_1.default.model('Property', propertySchema);
