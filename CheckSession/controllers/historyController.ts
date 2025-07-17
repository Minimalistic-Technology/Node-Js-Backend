import { Request, Response } from 'express';
import { HistoryModel } from '../models/history';

// CREATE
export const createHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = new HistoryModel(req.body);
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create history' });
  }
};

// READ ALL
export const getAllHistories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const histories = await HistoryModel.find().sort({ createdAt: -1 });
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get histories' });
  }
};

// READ ONE
export const getHistoryByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await HistoryModel.findOne({ userId: req.params.userId });
    if (!history)  res.status(404).json({ message: 'History not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

// UPDATE
export const updateHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const history = await HistoryModel.findOneAndUpdate({ userId: req.params.userId }, req.body, { new: true });
    if (!history)  res.status(404).json({ message: 'History not found' });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update history' });
  }
};

// DELETE
export const deleteHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    await HistoryModel.findOneAndDelete({ userId: req.params.userId });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete history' });
  }
};
