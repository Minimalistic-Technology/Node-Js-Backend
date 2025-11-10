import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/core/AppError';
import { env } from '@/config';
import { logger } from '@/core/logger'; // Assuming you set up pino/winston

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    logger.warn({
      code: err.errorCode,
      message: err.message,
      details: err.details,
    });
    return res.status(err.statusCode).json({
      error: err.errorCode,
      message: err.message,
      details: err.details,
    });
  }

  // Handle unexpected errors
  logger.error(err, 'An unexpected error occurred');

  return res.status(500).json({
    error: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred.',
    details: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

