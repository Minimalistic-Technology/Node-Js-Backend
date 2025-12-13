import { Request } from "express";
import { ActivityLog } from "../models/activityLog";
import mongoose from "mongoose";

export async function auditLog(params: {
  customerId: mongoose.Types.ObjectId | string;
  actorId: mongoose.Types.ObjectId | string;
  action: string;
  details?: any;
  req?: Request;
}) {
  try {
    const { customerId, actorId, action, details, req } = params;
    const ip = req ? (req.headers["x-forwarded-for"] || req.socket.remoteAddress) : undefined;
    const userAgent = req ? req.headers["user-agent"] : undefined;

    await ActivityLog.create({
      customerId,
      actorId,
      action,
      details,
      ip,
      userAgent,
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}
