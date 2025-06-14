import { Request, Response } from 'express';
import Event from '../../models/figma/event';

// Get all events
export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single event by ID
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new event
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const event = new Event(req.body);
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing event
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json(updatedEvent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete an event
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.status(200).json({ message: 'Event deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
