import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

interface UserCommentCount {
  count: number;
  resetTime: number;
}

// In-memory store for per-user comment counts
const userCommentCounts = new Map<string, UserCommentCount>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_COMMENTS = 5; // 5 comments per minute

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of userCommentCounts.entries()) {
    if (data.resetTime < now) {
      userCommentCounts.delete(userId);
    }
  }
}, 5 * 60 * 1000);

export const commentRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // This middleware should be used after requireAuth
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Authentication required'
    });
  }

  const userId = req.user.id;
  const now = Date.now();

  const userData = userCommentCounts.get(userId);

  if (!userData || userData.resetTime < now) {
    // New window or expired, reset count
    userCommentCounts.set(userId, {
      count: 0,
      resetTime: now + WINDOW_MS
    });
    return next();
  }

  if (userData.count >= MAX_COMMENTS) {
    const retryAfter = Math.ceil((userData.resetTime - now) / 1000);
    res.setHeader('Retry-After', retryAfter.toString());
    return res.status(StatusCodes.TOO_MANY_REQUESTS).json({
      message: 'Too many comments. Please try again later.',
      retryAfter
    });
  }

  // Increment count
  userData.count += 1;
  next();
};

