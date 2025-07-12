import { Request, Response } from "express";
import { StudentProfileModel } from "../models/studentProfile";

export const createStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = new StudentProfileModel(req.body);
    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(400).json({ error: "Failed to create student profile" });
  }
};

export const getAllStudentProfiles = async (_req: Request, res: Response): Promise<void> => {
  try {
    const profiles = await StudentProfileModel.find();
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch student profiles" });
  }
};

export const getStudentProfileById = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await StudentProfileModel.findById(req.params.id);
    if (!profile) res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Error fetching student profile" });
  }
};

export const updateStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await StudentProfileModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)  res.status(404).json({ error: "Profile not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update profile" });
  }
};

export const deleteStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await StudentProfileModel.findByIdAndDelete(req.params.id);
    if (!deleted) res.status(404).json({ error: "Profile not found" });
    res.json({ message: "Student profile deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete profile" });
  }
};
