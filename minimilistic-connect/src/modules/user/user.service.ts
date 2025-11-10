import User from '@/models/User.model';
import { AppError } from '@/core/AppError';
import { Document } from 'mongoose';

export const userService = {
  getProfile: async (id: string) => {
    const user = await User.findById(id).select('-passwordHash -passwordAlgo');

    if (!user) {
      throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
    }

    return user as Document & { email: string; name?: string };
  },
};

