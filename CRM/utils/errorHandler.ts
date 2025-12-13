import { Request, Response, NextFunction } from "express";
import { error as apiError } from "./apiResponse";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);

  if (res.headersSent) return next(err);

  if (err.name === "ValidationError") {
    return res.status(400).json(apiError("Validation failed", 400, err.errors));
  }

  if (err?.issues) {
    return res.status(400).json(apiError("Validation failed", 400, err.issues));
  }

  if (err.name === "UnauthorizedError" || err.name === "JsonWebTokenError") {
    return res.status(401).json(apiError("Unauthorized", 401));
  }

  const status = err.status || 500;
  const msg = err.message || "Internal Server Error";
  res.status(status).json(apiError(msg, status, err.details ?? null));
}
