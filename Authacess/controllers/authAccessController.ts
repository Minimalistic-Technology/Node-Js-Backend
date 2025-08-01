import { Request, Response } from "express";
import { AuthAccessModel } from "../models/authAccess";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET as string; // ✅ Loaded from .env

// Signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    const existing = await AuthAccessModel.findOne({ email });
    if (existing)  res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new AuthAccessModel({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body;
    const user = await AuthAccessModel.findOne({ email, role });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)  res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
