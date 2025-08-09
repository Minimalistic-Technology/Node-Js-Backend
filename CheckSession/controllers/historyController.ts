import { Request, Response } from 'express';
import { HistoryModel } from '../models/history';

interface AuthRequest extends Request {
  user?: any;
}

export const createHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const history = new HistoryModel(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create history' });
  }
};

export const getAllHistories = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const histories = await HistoryModel.find().sort({ createdAt: -1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get histories' });
  }
};

export const getHistoryByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'Admin';
    const isOwner = req.user?.id === req.params.userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const history = await HistoryModel.findOne({ userId: req.params.userId });
    if (!history) {
      res.status(404).json({ message: 'History not found' });
      return;
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

export const updateHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'Admin';
    const isOwner = req.user?.id === req.params.userId;

    if (!isAdmin && !isOwner) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const history = await HistoryModel.findOneAndUpdate(
      { userId: req.params.userId },
      req.body,
      { new: true }
    );

    if (!history) {
      res.status(404).json({ message: 'History not found' });
      return;
    }

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update history' });
  }
};

export const deleteHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await HistoryModel.findOneAndDelete({ userId: req.params.userId });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
};
