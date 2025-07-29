import { Request, Response } from 'express';
import GfgUser from '../models/userModel';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    const user = new GfgUser({ username, email, password, role, problemSolved: 0 });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Signup failed', details: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const user = await GfgUser.findOne({ email, password }); 
  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }
  res.status(200).json(user);
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const user = await GfgUser.findById(userId);
  if (!user)  res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
};

export const updateUsername = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { username } = req.body;
  const user = await GfgUser.findByIdAndUpdate(userId, { username }, { new: true });
  if (!user)  res.status(404).json({ error: 'User not found' });
  res.status(200).json(user);
};

export const updateProblemSolved = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  const { increment } = req.body;
  const user = await GfgUser.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  user.problemSolved += increment;
  await user.save();
  res.status(200).json(user);
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;
  await GfgUser.findByIdAndDelete(userId);
  res.status(200).json({ message: 'User deleted' });
};
