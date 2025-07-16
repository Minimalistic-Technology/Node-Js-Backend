import { Request, Response } from "express";
import { AdminUserModel } from "../models/adminUser";

// Create
export const createAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await AdminUserModel.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: "Failed to create user", details: err });
  }
};

// Read all
export const getAllAdminUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await AdminUserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Read by ID
export const getAdminUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await AdminUserModel.findById(req.params.id);
    if (!user)  res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error retrieving user" });
  }
};

// Update
export const updateAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await AdminUserModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update user" });
  }
};

// Delete
export const deleteAdminUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await AdminUserModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};
