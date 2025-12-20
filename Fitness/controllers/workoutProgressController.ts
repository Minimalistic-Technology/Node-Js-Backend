import { Request, Response } from 'express';
import WorkoutProgress from '../models/WorkoutProgress';

export const createProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const progress = new WorkoutProgress(req.body);
    await progress.save();
    res.status(201).json(progress);
  } catch (error) {
    res.status(400).json({ error: 'Failed to save workout progress' });
  }
};

export const getProgress = async (_req: Request, res: Response): Promise<void> => {
  try {
    const progress = await WorkoutProgress.find();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};

export const updateProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await WorkoutProgress.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
       res.status(404).json({ error: 'Progress not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update progress' });
  }
};

export const deleteProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await WorkoutProgress.findByIdAndDelete(req.params.id);
    if (!deleted) {
       res.status(404).json({ error: 'Progress not found' });
    }
    res.json({ message: 'Progress deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete progress' });
  }
};
