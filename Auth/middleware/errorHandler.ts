import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/ErrorHandler';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ErrorHandler) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
    return;
  }

  res.status(500).json({ success: false, message: 'Internal Server Error' });
};

export default errorHandler;






