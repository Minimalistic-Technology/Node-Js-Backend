import { Request, Response } from "express";
import { AdminProfileModel } from "../models/adminProfile";

export const createAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = new AdminProfileModel(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: "Failed to create admin profile" });
  }
};

export const getAllAdminProfiles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await AdminProfileModel.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin profiles" });
  }
};

export const getAdminProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await AdminProfileModel.findById(req.params.id);
    if (!profile)  res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Error fetching admin profile" });
  }
};

export const updateAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await AdminProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)  res.status(404).json({ error: "Profile not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update admin profile" });
  }
};

export const deleteAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await AdminProfileModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Admin profile deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete admin profile" });
  }
};
