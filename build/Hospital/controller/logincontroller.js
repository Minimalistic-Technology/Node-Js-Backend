"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserByToken = exports.updateUserRole = exports.getAllUsers = exports.logout = exports.refreshToken = exports.login = exports.signup = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const login_1 = __importDefault(require("../../models/hospital/login"));
// Generate access token
const generateAccessToken = (userID) => {
    return jsonwebtoken_1.default.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
// Generate refresh token
const generateRefreshToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.userID;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};
exports.authenticateToken = authenticateToken;
// Signup
const signup = async (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email, and password are required' });
        return;
    }
    if (!['student', 'faculty', 'admin'].includes(role)) {
        res.status(400).json({ error: 'Invalid role' });
        return;
    }
    try {
        const userExists = await login_1.default.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            res.status(400).json({ error: 'Username or email already registered' });
            return;
        }
        const newUser = new login_1.default({ username, email, password, role });
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    }
    catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Signup failed' });
    }
};
exports.signup = signup;
// Login
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }
    try {
        const user = await login_1.default.findOne({ email });
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
        res.json({
            message: 'Login successful',
            accessToken,
            user: { id: user._id, username: user.username, role: user.role },
        });
    }
    catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
};
exports.login = login;
// Refresh token
const refreshToken = (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) {
        res.status(401).json({ error: 'Refresh token missing' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        const accessToken = generateAccessToken(decoded.userId);
        res.json({ accessToken });
    }
    catch (err) {
        res.status(403).json({ error: 'Invalid refresh token' });
    }
};
exports.refreshToken = refreshToken;
// Logout
const logout = (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await login_1.default.find({}, { password: 0 });
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};
exports.getAllUsers = getAllUsers;
// Update user role
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (!req.userID) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        if (!['student', 'faculty', 'admin'].includes(role)) {
            res.status(400).json({ error: 'Invalid role' });
            return;
        }
        const user = await login_1.default.findByIdAndUpdate(id, { role }, { new: true, runValidators: true });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'Role updated successfully', user: { id: user._id, username: user.username, role: user.role } });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update role' });
    }
};
exports.updateUserRole = updateUserRole;
// Get user by token
const getUserByToken = async (req, res) => {
    try {
        if (!req.userID) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const user = await login_1.default.findById(req.userID, { password: 0 });
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.status(200).json({ id: user._id, username: user.username, role: user.role });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};
exports.getUserByToken = getUserByToken;
