"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.getProfile = exports.createProfile = void 0;
const Profile_1 = __importDefault(require("../models/Profile"));
// Create Profile
const createProfile = async (req, res) => {
    try {
        const profile = new Profile_1.default(req.body);
        await profile.save();
        res.status(201).json(profile);
    }
    catch (err) {
        console.error('Create Error:', err);
        res.status(400).json({ error: err.message });
    }
};
exports.createProfile = createProfile;
// Get Profile by Email
const getProfile = async (req, res) => {
    try {
        const { email } = req.query;
        if (typeof email !== 'string') {
            res.status(400).json({ error: 'Invalid email query parameter' });
            return;
        }
        const profile = await Profile_1.default.findOne({ email }, 'firstName lastName email');
        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }
        res.json(profile);
    }
    catch (err) {
        console.error('Get Error:', err);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
exports.getProfile = getProfile;
// Update Profile
const updateProfile = async (req, res) => {
    try {
        const { email, firstName, lastName, password, confirmPassword } = req.body;
        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: 'Email is required' });
            return;
        }
        if (password && password !== confirmPassword) {
            res.status(400).json({ error: 'Passwords do not match' });
            return;
        }
        const profile = await Profile_1.default.findOneAndUpdate({ email }, { firstName, lastName, password }, { new: true });
        if (!profile) {
            res.status(404).json({ error: 'Profile not found' });
            return;
        }
        res.json(profile);
    }
    catch (err) {
        console.error('Update Error:', err);
        res.status(400).json({ error: err.message });
    }
};
exports.updateProfile = updateProfile;
