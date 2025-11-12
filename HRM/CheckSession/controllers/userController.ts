import path from "path";
import fs from "fs";
import { Request, Response } from "express";
import User from "../models/user";
import UserAudit from "../models/userAudit";

const recordAudit = async (
  userId: string,
  changedBy: string,
  changes: any[],
  reason?: string
) => {
  await UserAudit.create({ userId, changedBy, changes, reason });
};

export const getMyProfile = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = (req as any).user.uid;
  const user = await User.findOne({ userId: firebaseUid }).lean();
  if (!user) {
    res.status(404).json({ message: "Profile not found" });
    return;
  }
  res.json(user);
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const requester = (req as any).user;
  const user = await User.findOne({ userId: id }).lean();
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  if (requester.uid === id || requester.role === "admin") {
    res.json(user);
    return;
  }
  res.status(403).json({ message: "Forbidden" });
};

export const updateMyProfile = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = (req as any).user.uid;
  const allowed = [
    "name",
    "phone",
    "avatarUrl",
    "jobTitle",
    "department",
    "location",
    "customFields",
  ];
  const updates: any = {};
  for (const key of allowed) if (key in req.body) updates[key] = req.body[key];
  const oldUser = await User.findOne({ userId: firebaseUid });
  if (!oldUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const updatedUser = await User.findOneAndUpdate(
    { userId: firebaseUid },
    { $set: updates, updatedAt: new Date() },
    { new: true }
  );
  const changes = Object.keys(updates).map((field) => ({
    field,
    oldValue: (oldUser as any)[field],
    newValue: (updatedUser as any)[field],
  }));
  await recordAudit(firebaseUid, firebaseUid, changes);
  res.json(updatedUser);
};

export const adminUpdateProfile = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { editReason } = req.body;
  const adminUser = (req as any).user;
  if (!editReason) {
    res.status(400).json({ message: "editReason required" });
    return;
  }
  const oldUser = await User.findOne({ userId: id });
  if (!oldUser) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  const updates = { ...req.body };
  delete updates.editReason;
  const updatedUser = await User.findOneAndUpdate(
    { userId: id },
    { $set: updates, updatedAt: new Date() },
    { new: true }
  );
  const changes = Object.keys(updates).map((field) => ({
    field,
    oldValue: (oldUser as any)[field],
    newValue: (updatedUser as any)[field],
  }));
  await recordAudit(id, adminUser.uid, changes, editReason);
  res.json(updatedUser);
};

export const getUserAudit = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const logs = await UserAudit.find({ userId: id }).sort({ timestamp: -1 });
  res.json(logs);
};

export const uploadAvatar = async (req: Request, res: Response): Promise<void> => {
  const firebaseUid = (req as any).user.uid;
  if (!req.file) {
    res.status(400).json({ message: "No image uploaded" });
    return;
  }
  const avatarPath = path.join("uploads", req.file.filename);
  const avatarUrl = `${req.protocol}://${req.get("host")}/${avatarPath}`;
  try {
    const user = await User.findOneAndUpdate(
      { userId: firebaseUid },
      { avatarUrl, updatedAt: new Date() },
      { new: true }
    );
    if (!user) {
      fs.unlinkSync(avatarPath);
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ message: "Avatar uploaded successfully", avatarUrl });
  } catch (err) {
    console.error("Avatar upload error:", err);
    res.status(500).json({ message: "Server error during avatar upload" });
  }
};
