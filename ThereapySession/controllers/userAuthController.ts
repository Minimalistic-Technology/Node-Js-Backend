import { Request, Response } from 'express';
import User from '../models/userAuthModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface OtpEntry {
    otp: string;
    expiresAt: number;
    userData: any;
}
const otpStore = new Map<string, OtpEntry>();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const { fullName, email, phoneNumber, dob, location, gender, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            res.status(400).json({ message: "Passwords do not match" });
            return;
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; 

        otpStore.set(email, { otp, expiresAt, userData: { fullName, email, phoneNumber, dob, location, gender, password } });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your OTP for Signup",
            text: `Hello ${fullName}, your OTP is ${otp}. It is valid for 5 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending OTP", error });
    }
};

export const verifyOtpAndSignup = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = otpStore.get(email);

        if (!otpEntry) {
            res.status(400).json({ message: "OTP not found or expired" });
            return;
        }

        if (Date.now() > otpEntry.expiresAt) {
            otpStore.delete(email);
            res.status(400).json({ message: "OTP expired" });
            return;
        }

        if (otpEntry.otp !== otp) {
            res.status(400).json({ message: "Invalid OTP" });
            return;
        }

        const { fullName, phoneNumber, dob, location, gender, password } = otpEntry.userData;

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            dob,
            location,
            gender,
            password: hashedPassword,
        });

        await newUser.save();

        otpStore.delete(email);

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error verifying OTP", error });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: '1d' });

        res.status(200).json({
            token,
            user: { id: user._id, email: user.email, fullName: user.fullName },
        });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
