"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtp = void 0;
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const sendOtp = async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: "Name and email are required" });
        return;
    }
    const otp = (0, generateOTP_1.default)();
    try {
        await (0, sendMail_1.default)({
            email,
            subject: "Your OTP Code",
            template: "otp-template.ejs", // Make sure this file exists
            data: { name, otp },
        });
        res.status(200).json({ message: "OTP sent successfully", otp });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to send OTP", error });
    }
};
exports.sendOtp = sendOtp;
