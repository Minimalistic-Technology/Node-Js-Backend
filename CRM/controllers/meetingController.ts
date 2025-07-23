import { Request, Response } from "express";
import { MeetingModel } from "../models/meeting";
import { NotificationModel } from "../models/notification";

// Create a new meeting
export const createMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const meeting = new MeetingModel(req.body);
    await meeting.save();

    await NotificationModel.create({
      userId: req.body.owner || "system",
      message: `New meeting "${meeting.name}" created.`,
      type: "meeting",
    });

    res.status(201).json(meeting);
  } catch (err) {
    console.error("Create Meeting Error:", err);
    res.status(400).json({ error: "Failed to create meeting" });
  }
};

// Get all meetings
export const getAllMeetings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const meetings = await MeetingModel.find();
    res.status(200).json(meetings);
  } catch (err) {
    console.error("Fetch Meetings Error:", err);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

// Get meeting by ID
export const getMeetingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const meeting = await MeetingModel.findById(req.params.id);
    if (!meeting) {
      res.status(404).json({ error: "Meeting not found" });
      return;
    }
    res.status(200).json(meeting);
  } catch (err) {
    console.error("Get Meeting Error:", err);
    res.status(500).json({ error: "Failed to get meeting" });
  }
};

// Update a meeting
export const updateMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await MeetingModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Meeting not found" });
      return;
    }

    await NotificationModel.create({
      userId: req.body.owner || "system",
      message: `Meeting "${updated.name}" updated.`,
      type: "meeting",
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error("Update Meeting Error:", err);
    res.status(400).json({ error: "Failed to update meeting" });
  }
};

// Delete a meeting
export const deleteMeeting = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await MeetingModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Meeting not found" });
      return;
    }

    await NotificationModel.create({
      userId: "system",
      message: `Meeting "${deleted.name}" deleted.`,
      type: "meeting",
    });

    res.status(200).json({ message: "Meeting deleted" });
  } catch (err) {
    console.error("Delete Meeting Error:", err);
    res.status(400).json({ error: "Failed to delete meeting" });
  }
};
