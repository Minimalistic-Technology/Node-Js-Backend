import { Request, Response } from "express";
import { UserProfileModel } from "../models/userProfile";

// CREATE
export const createUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new UserProfileModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Failed to create user profile" });
  }
};

// GET ALL
export const getAllProfiles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await UserProfileModel.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};

// GET BY ID
export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await UserProfileModel.findById(req.params.id);
    if (!profile) res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// UPDATE
export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await UserProfileModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: "Profile not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update profile" });
  }
};

// DELETE
export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await UserProfileModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Profile deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
};
