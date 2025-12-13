import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { error as apiError } from "../utils/apiResponse";

export function validateBody(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      return res.status(400).json(apiError("Validation error", 400, err));
    }
  };
}

export function validateQuery(schema: ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query);
      next();
    } catch (err) {
      return res.status(400).json(apiError("Validation error", 400, err));
    }
  };
}
