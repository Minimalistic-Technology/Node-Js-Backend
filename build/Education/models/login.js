"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'faculty', 'admin'], required: true, default: 'student' },
    createdAt: { type: Date, default: Date.now },
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt_1.default.hash(this.password, 10);
    next();
});
const User = mongoose_1.default.model('User', userSchema);
// Seed dummy users
const seedUsers = async () => {
    try {
        const existingUsers = await User.find();
        if (existingUsers.length === 0) {
            const dummyUsers = [
                { username: 'student1', email: 'student1@example.com', password: '1234', role: 'student' },
                { username: 'faculty1', email: 'faculty1@example.com', password: 'abcd', role: 'faculty' },
                { username: 'admin1', email: 'admin1@example.com', password: 'admin123', role: 'admin' },
            ];
            for (const user of dummyUsers) {
                const hashedPassword = await bcrypt_1.default.hash(user.password, 10);
                await User.create({
                    username: user.username,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                });
            }
            console.log('Dummy users seeded successfully');
        }
    }
    catch (error) {
        console.error('Error seeding users:', error);
    }
};
exports.seedUsers = seedUsers;
exports.default = User;
