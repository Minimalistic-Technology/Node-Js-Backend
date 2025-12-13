import { Request, Response, NextFunction } from "express";
import { error as apiError } from "../utils/apiResponse";
import { AuthRequest } from "./authMiddleware";

export function requireRole(allowedRoles: string[] = []) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json(apiError("Not authenticated", 401));
    if (allowedRoles.length === 0) return next();

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json(apiError("Forbidden - insufficient role", 403));
    }
    next();
  };
}
