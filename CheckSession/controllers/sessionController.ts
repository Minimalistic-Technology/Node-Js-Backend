import { Request, Response } from 'express';
import { SessionModel } from '../models/session';

// Create (Check-In)
export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = new SessionModel({
      userId: req.body.userId,
      checkIn: new Date()
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: 'Check-in failed' });
  }
};

// Update (Check-Out)
export const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await SessionModel.findByIdAndUpdate(
      req.params.id,
      { checkOut: new Date() },
      { new: true }
    );
    if (!session) res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Check-out failed' });
  }
};

// Read all sessions
export const getAllSessions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await SessionModel.find().sort({ createdAt: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// Read one session
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session)  res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching session' });
  }
};

// Delete session
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    await SessionModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
};
