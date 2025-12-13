import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { error as apiError } from "../utils/apiResponse";

const JWT_SECRET = process.env.JWT_SECRET || "replace-with-secure-secret";

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(apiError("Authorization header missing", 401));
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;
    req.user = { id: payload.sub || payload.userId, role: payload.role, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json(apiError("Invalid or expired token", 401));
  }
}
