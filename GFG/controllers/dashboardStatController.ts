import DashboardStat from '../models/dashboardStatModel';
import { Request, Response } from 'express';

export const createStat = async (req: Request, res: Response): Promise<void> => {
  try {
    const stat = new DashboardStat(req.body);
    await stat.save();
    res.status(201).json(stat);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create stat', details: err });
  }
};

export const getAllStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await DashboardStat.find();
    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const updateStat = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await DashboardStat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) res.status(404).json({ error: 'Stat not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update stat' });
  }
};

export const deleteStat = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await DashboardStat.findByIdAndDelete(req.params.id);
    if (!deleted) res.status(404).json({ error: 'Stat not found' });
    res.status(200).json({ message: 'Stat deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete stat' });
  }
};
