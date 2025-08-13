import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import FitnessProfile from "../models/FitnessProfile";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, phone, description } = req.body;

    const existingUser = await FitnessProfile.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    const newUser = await FitnessProfile.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      description,
    });

    const token = generateToken(newUser._id.toString());
    res.status(201).json({ token });
  } catch (error) {
    res.status(400).json({ message: "Error signing up", error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await FitnessProfile.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};
