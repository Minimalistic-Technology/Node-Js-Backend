import { Request, Response } from 'express';
import { HistoryModel } from '../models/history';

interface AuthRequest extends Request {
  user?: any;
}

// CREATE
export const createHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = new HistoryModel(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create history' });
  }
};

// READ ALL (Admin only)
export const getAllHistories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const histories = await HistoryModel.find().sort({ createdAt: -1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get histories' });
  }
};

// READ ONE (User sees own)
export const getHistoryByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'Admin' && req.user.id !== req.params.userId) {
       res.status(403).json({ message: 'Access denied' });
    }

    const history = await HistoryModel.findOne({ userId: req.params.userId });
    if (!history)  res.status(404).json({ message: 'History not found' });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// UPDATE
export const updateHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (req.user.role !== 'Admin' && req.user.id !== req.params.userId) {
       res.status(403).json({ message: 'Access denied' });
    }

    const history = await HistoryModel.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );

    if (!history)  res.status(404).json({ message: 'History not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update history' });
  }
};

// DELETE (Admin only)
export const deleteHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await HistoryModel.findOneAndDelete({ userId: req.params.userId });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
};
