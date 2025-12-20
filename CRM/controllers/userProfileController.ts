import { Request, Response } from "express";
import { UserProfileModel } from "../models/userProfile";


export const createUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = new UserProfileModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    console.error("Create error:", err);
    res.status(400).json({ error: "Failed to create user profile" });
  }
};

export const getAllProfiles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await UserProfileModel.find().lean();
    res.json(profiles);
  } catch (err) {
    console.error("Fetch all error:", err);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
};


export const getProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await UserProfileModel.findById(req.params.id).lean();
    if (!profile) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(profile);
  } catch (err) {
    console.error("Fetch by ID error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await UserProfileModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: "Failed to update profile" });
  }
};


export const deleteUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await UserProfileModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Profile not found" });
      return;
    }
    res.json({ message: "Profile deleted" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete profile" });
  }
};
