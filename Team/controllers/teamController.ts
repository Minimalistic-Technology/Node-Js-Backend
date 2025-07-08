import { Request, Response } from "express";
import { TeamModel } from "../models/team";

// Create
export const createTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = new TeamModel(req.body);
    await member.save();
    res.status(201).json(member);
  } catch (err) {
    res.status(400).json({ error: "Failed to create team member" });
  }
};

// Get All
export const getAllTeamMembers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const members = await TeamModel.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
};

// Get By ID
export const getTeamMemberById = async (req: Request, res: Response): Promise<void> => {
  try {
    const member = await TeamModel.findById(req.params.id);
    if (!member)  res.status(404).json({ error: "Team member not found" });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: "Error fetching team member" });
  }
};

// Update
export const updateTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await TeamModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: "Team member not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update team member" });
  }
};

// Delete
export const deleteTeamMember = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await TeamModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Team member not found" });
    res.json({ message: "Team member deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete team member" });
  }
};
