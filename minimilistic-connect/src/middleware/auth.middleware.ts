import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/core/AppError';
import { tokenService } from '@/services/token.service';
import User from '@/models/User.model';
import { Document } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: Document & { id: string; email: string; emailVerified: boolean; };
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(401, 'AUTH_UNAUTHORIZED', 'No token provided');
    }

    const token = authHeader.split(' ')[1];
    const payload = tokenService.verifyAccessToken(token);

    if (!payload) {
      throw new AppError(401, 'AUTH_UNAUTHORIZED', 'Invalid or expired token');
    }

    const user = await User.findById(payload.sub);

    if (!user) {
      throw new AppError(401, 'AUTH_UNAUTHORIZED', 'User not found');
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
