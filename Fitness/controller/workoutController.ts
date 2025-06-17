import { Request, Response } from 'express';
import Workout from '../../models/Workout';

export const createWorkout = async (req: Request, res: Response) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create workout' });
  }
};

export const getWorkouts = async (_req: Request, res: Response) => {
  try {
    const workouts = await Workout.find();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

export const updateWorkout = async (req: Request, res: Response) => {
  try {
    const updated = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Workout not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update workout' });
  }
};

export const deleteWorkout = async (req: Request, res: Response) => {
  try {
    const deleted = await Workout.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};