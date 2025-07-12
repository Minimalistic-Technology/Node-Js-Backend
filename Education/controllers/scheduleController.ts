import { Request, Response } from 'express';
import Schedule, { ISchedule } from '../models/schedule';

// Get all schedules
export const getAllSchedules = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedules = await Schedule.find().sort({ createdAt: -1 });
    res.status(200).json(schedules);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedules', error });
  }
};

// Get schedule by ID
export const getScheduleById = async (req: Request, res: Response): Promise<void> => {
  try {
    const schedule = await Schedule.findById(req.params.id);
    if (!schedule) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }
    res.status(200).json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error });
  }
};

// Create a new schedule
export const createSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { days, subject, startTime, endTime, faculty } = req.body;

    // Validate required fields
    if (!days || !subject || !startTime || !endTime || !faculty) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Validate days array
    if (!Array.isArray(days) || days.length === 0) {
      res.status(400).json({ message: 'Days must be a non-empty array' });
      return;
    }

    const newSchedule: ISchedule = new Schedule({
      days,
      subject,
      startTime,
      endTime,
      faculty,
    });

    await newSchedule.save();
    res.status(201).json({ message: 'Schedule created successfully', schedule: newSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Error creating schedule', error });
  }
};

// Update a schedule by ID
export const updateSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const { days, subject, startTime, endTime, faculty } = req.body;

    // Validate days array if provided
    if (days && (!Array.isArray(days) || days.length === 0)) {
      res.status(400).json({ message: 'Days must be a non-empty array' });
      return;
    }

    const updatedSchedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { days, subject, startTime, endTime, faculty },
      { new: true, runValidators: true }
    );

    if (!updatedSchedule) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }

    res.status(200).json({ message: 'Schedule updated successfully', schedule: updatedSchedule });
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error });
  }
};

// Delete a schedule by ID
export const deleteSchedule = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(req.params.id);
    if (!deletedSchedule) {
      res.status(404).json({ message: 'Schedule not found' });
      return;
    }
    res.status(200).json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule', error });
  }
};