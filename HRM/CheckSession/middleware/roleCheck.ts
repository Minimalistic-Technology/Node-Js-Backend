import { Request, Response, NextFunction } from "express";

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = (req as any).user;

  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  if (user.role !== "admin") {
    res.status(403).json({ message: "Forbidden: Admin access required" });
    return;
  }

  next();
};
