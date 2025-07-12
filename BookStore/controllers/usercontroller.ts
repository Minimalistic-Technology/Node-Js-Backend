import { Request, Response } from 'express';
import { User } from '../models/bulkUsers';

// POST /api/users/bulk - Bulk create users
export const bulkCreateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { users } = req.body;

    if (!Array.isArray(users) || users.length === 0) {
      res.status(400).json({ message: 'Users array is required and cannot be empty.' });
      return;
    }

    const validUsers = users.map((u: any) => ({
      username: u.username,
      email: u.email,
      role: u.role || 'user',
      // Password is optional, not included unless provided
    })).filter(u => u.username && u.email);

    if (validUsers.length === 0) {
      res.status(400).json({ message: 'No valid users provided.' });
      return;
    }

    const savedUsers = await User.insertMany(validUsers, { ordered: false });

    res.status(201).json({
      success: true,
      message: 'Users added successfully',
      users: savedUsers,
    });
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: err.errors,
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Server error',
        error: err.message,
      });
    }
  }
};