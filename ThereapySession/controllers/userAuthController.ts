import { Request, Response } from 'express';
import User from '../models/userAuthModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Signup API
export const signupUser = async (req: Request, res: Response): Promise<void> => {
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

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullName,
            email,
            phoneNumber,
            dob,
            location,
            gender,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
};

// Login API
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

        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1d' });

        res.status(200).json({ token, user: { id: user._id, email: user.email, fullName: user.fullName } });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
