import { Request, Response } from "express";
import { MeetingModel } from "../models/meeting";

// Create
export const createMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const meeting = new MeetingModel(req.body);
    await meeting.save();
    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ error: "Failed to create meeting" });
  }
};

// Get All
export const getAllMeetings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const meetings = await MeetingModel.find();
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

// Get by ID
export const getMeetingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const meeting = await MeetingModel.findById(req.params.id);
    if (!meeting)  res.status(404).json({ error: "Meeting not found" });
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ error: "Failed to get meeting" });
  }
};

// Update
export const updateMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await MeetingModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated)  res.status(404).json({ error: "Meeting not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update meeting" });
  }
};

// Delete
export const deleteMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await MeetingModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Meeting not found" });
    res.json({ message: "Meeting deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete meeting" });
  }
};
