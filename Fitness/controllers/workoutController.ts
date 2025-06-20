import { Request, Response } from 'express';
import Workout from '../models/Workout';

export const createWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch {
    res.status(400).json({ error: 'Failed to create workout' });
  }
};

export const getWorkouts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

export const updateWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: 'Workout not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Failed to update workout' });
  }
};

export const deleteWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Workout.findByIdAndDelete(req.params.id);
    if (!deleted) res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};
