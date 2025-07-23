import { Request, Response } from 'express';
import { SessionModel } from '../models/session';

// Create (Check-In)
export const checkIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = new SessionModel({
      userId: req.body.userId,
      checkIn: new Date(),
    });
    await session.save();
    if (!session.checkIn || isNaN(session.checkIn.getTime())) {
      throw new Error('Invalid check-in time generated');
    }
    console.log('Check-in session created:', session.toJSON()); // Debug log with plain object
    res.status(201).json(session.toJSON());
  } catch (error) {
    console.error('Check-in error:', error);
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
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    if (!session.checkOut || isNaN(session.checkOut.getTime())) {
      throw new Error('Invalid check-out time generated');
    }
    console.log('Check-out session updated:', session.toJSON()); // Debug log with plain object
    res.json(session.toJSON());
  } catch (error) {
    console.error('Check-out error:', error);
    res.status(500).json({ error: 'Check-out failed' });
  }
};

// Update Check-In Time
export const updateCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await SessionModel.findByIdAndUpdate(
      req.params.id,
      { checkIn: new Date() },
      { new: true }
    );
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    if (!session.checkIn || isNaN(session.checkIn.getTime())) {
      throw new Error('Invalid check-in time generated');
    }
    console.log('Check-in time updated:', session.toJSON()); // Debug log with plain object
    res.json(session.toJSON());
  } catch (error) {
    console.error('Update check-in error:', error);
    res.status(500).json({ error: 'Failed to update check-in time' });
  }
};

// Read all sessions
export const getAllSessions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await SessionModel.find().sort({ createdAt: -1 });
    const validSessions = sessions.map(session => {
      if (!session.checkIn || isNaN(session.checkIn.getTime())) {
        console.warn('Invalid check-in found in session:', session._id);
      }
      return session.toJSON();
    });
    console.log('Fetched sessions:', validSessions); // Debug log with plain objects
    res.json(validSessions);
  } catch (error) {
    console.error('Fetch sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// Read one session
export const getSessionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) {
      res.status(404).json({ message: 'Session not found' });
      return;
    }
    if (!session.checkIn || isNaN(session.checkIn.getTime())) {
      console.warn('Invalid check-in found in session:', session._id);
    }
    console.log('Fetched session by ID:', session.toJSON()); // Debug log with plain object
    res.json(session.toJSON());
  } catch (error) {
    console.error('Fetch session error:', error);
    res.status(500).json({ error: 'Error fetching session' });
  }
};

// Delete session
export const deleteSession = async (req: Request, res: Response): Promise<void> => {
  try {
    await SessionModel.findByIdAndDelete(req.params.id);
    console.log('Session deleted:', req.params.id); // Debug log
    res.status(204).send();
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};


// Add this to your sessionController.ts
export const getUserSessions = async (req: Request, res: Response): Promise<void> => {
  try {
    const sessions = await SessionModel.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    const validSessions = sessions.map(session => session.toJSON());
    res.json(validSessions);
  } catch (error) {
    console.error('Error fetching user sessions:', error);
    res.status(500).json({ error: 'Failed to fetch user sessions' });
  }
};