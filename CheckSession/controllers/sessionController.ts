import { Request, Response } from 'express';
import { SessionModel } from '../models/session';
import { AuthUserModel } from '../models/authUser';
import { HistoryModel } from '../models/history';
import { LocationModel } from '../models/location';

export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, time, location } = req.body;
    const newSession = new SessionModel({ userId, checkIn: time, location });
    await newSession.save();
    res.status(201).json({ message: 'Check-in successful', session: newSession });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Check-in failed' });
  }
};

export const checkOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { time } = req.body;
    const updated = await SessionModel.findByIdAndUpdate(
      id,
      { checkOut: time },
      { new: true }
    );
    if (!updated)  res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Check-out successful', session: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Check-out failed' });
  }
};

export const updateCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { time } = req.body;
    const updated = await SessionModel.findByIdAndUpdate(
      id,
      { checkIn: time },
      { new: true }
    );
    if (!updated)  res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Check-in time updated', session: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update check-in time' });
  }
};

export const getUserSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const sessions = await SessionModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
};

export const getFullUserDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    const user = await AuthUserModel.findById(userId).select('-password');
    const sessions = await SessionModel.find({ userId }).sort({ createdAt: -1 });
    const history = await HistoryModel.findOne({ userId });
    const locations = await LocationModel.find().sort({ createdAt: -1 });

    if (!user) res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user, sessions, history, locations });
  } catch (err) {
    console.error('Error fetching full user details:', err);
    res.status(500).json({ error: 'Failed to fetch full user data' });
  }
};

export const getAllSessions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await SessionModel.find().sort({ createdAt: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session)  res.status(404).json({ message: 'Session not found' });
    res.status(200).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
};

export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await SessionModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ message: 'Session not found' });
    res.status(200).json({ message: 'Session deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};
