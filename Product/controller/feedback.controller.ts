import { Request, Response } from 'express';
import { FeedbackModel } from '../models/feedback.model';

export const postFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = new FeedbackModel(req.body);
    const saved = await feedback.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Error submitting feedback' });
  }
};

export const getFeedback = async (_req: Request, res: Response) => {
  try {
    const feedbacks = await FeedbackModel.find();
    res.json(feedbacks);
  } catch {
    res.status(500).json({ error: 'Error fetching feedback' });
  }
};

export const updateFeedback = async (req: Request, res: Response) => {
  try {
    const updated = await FeedbackModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Feedback not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Error updating feedback' });
  }
};

export const deleteFeedback = async (req: Request, res: Response) => {
  try {
    const deleted = await FeedbackModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Feedback not found' });
    res.json({ message: 'Feedback deleted' });
  } catch {
    res.status(500).json({ error: 'Error deleting feedback' });
  }
};
