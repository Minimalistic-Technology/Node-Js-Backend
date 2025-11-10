import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '@/core/AppError';

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(
          new AppError(400, 'VALIDATION_ERROR', 'Invalid request data', error.errors)
        );
      } else {
        next(new AppError(500, 'INTERNAL_ERROR', 'Internal server error'));
      }
    }
  };
