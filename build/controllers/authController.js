"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const sendMail_1 = __importDefault(require("../utils/sendMail"));
const generateAccessToken = (userID) => {
    return jsonwebtoken_1.default.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
const generateRefreshToken = (userID) => {
    return jsonwebtoken_1.default.sign({ userID }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
const signup = async (req, res) => {
    const { name, email, password, phone, institute } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email, and password are required" });
        return;
    }
    try {
        const userExists = await User_1.default.findOne({ $or: [{ username: name }, { email }] });
        if (userExists) {
            res.status(400).json({ error: 'Name or email already registered' });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = new User_1.default({
            username: name,
            email,
            password: hashedPassword,
            phone,
            institute
        });
        await newUser.save();
        if (email && typeof email === 'string' && email.trim() !== '') {
            try {
                await (0, sendMail_1.default)({
                    email,
                    subject: 'Welcome to Our App!',
                    template: 'welcome.ejs',
                    data: { username: name }
                });
            }
            catch (mailError) {
                console.error("Error sending welcome email:", mailError);
                // Email failure should not prevent signup
            }
        }
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ error: 'Signup failed' });
    }
};
exports.signup = signup;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
    }
    try {
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ error: 'User not found' });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Incorrect password' });
            return;
        }
        const accessToken = generateAccessToken(user._id.toString());
        const refreshToken = generateRefreshToken(user._id.toString());
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({ message: 'Login successful', accessToken });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
const refreshToken = (req, res) => {
    const token = req.cookies?.refreshToken;
    if (!token) {
        res.status(401).json({ error: 'Refresh token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateAccessToken(decoded.userID);
        res.json({ accessToken });
    }
    catch (err) {
        console.error("Refresh token error:", err);
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
