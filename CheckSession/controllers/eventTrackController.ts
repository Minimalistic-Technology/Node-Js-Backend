import { Request, Response } from "express";
import { EventTrackModel } from "../models/eventTrack";

// CREATE
export const trackEventClick = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, eventName, ip, city, country, timestamp } = req.body;

    if (!eventId || !eventName) {
       res.status(400).json({ message: "eventId and eventName are required" });
    }

    const eventData = new EventTrackModel({
      eventId,
      eventName,
      ip: ip || req.ip,
      city,
      country,
      timestamp: timestamp || new Date().toISOString()
    });

    await eventData.save();
    res.status(201).json({ message: "Event tracked successfully", data: eventData });
  } catch (error) {
    res.status(500).json({ error: "Failed to track event" });
  }
};

// READ ALL
export const getAllEventTracks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await EventTrackModel.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// READ BY ID
export const getEventTrackById = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await EventTrackModel.findById(req.params.id);
    if (!data)  res.status(404).json({ message: "Event not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching event" });
  }
};

// UPDATE
export const updateEventTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await EventTrackModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated", data: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// DELETE
export const deleteEventTrack = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await EventTrackModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};
