import mongoose from 'mongoose';
import { env } from '@/config';
import { logger } from '@/core/logger';

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URL);
    logger.info('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
