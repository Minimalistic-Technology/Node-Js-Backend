import { Request, Response } from "express";
import mongoose from "mongoose";
import { ActivityLog } from "../models/activityLog";
import { success, error as apiError } from "../utils/apiResponse";
import { parsePagination, buildSort } from "../utils/pagination";

export async function getActivityLogsForCustomer(req: Request, res: Response) {
  try {
    const customerId = req.params.customerId;
    if (!mongoose.Types.ObjectId.isValid(customerId)) return res.status(400).json(apiError("Invalid customer id", 400));

    const { page, limit, skip } = parsePagination(req.query);
    const sort = buildSort((req.query.sortBy as string) || "createdAt", req.query.order as string);

    const filter: any = { customerId };

    if (req.query.actorId && mongoose.Types.ObjectId.isValid(String(req.query.actorId))) {
      filter.actorId = req.query.actorId;
    }

    const [total, items] = await Promise.all([
      ActivityLog.countDocuments(filter),
      ActivityLog.find(filter).sort(sort as any).skip(skip).limit(limit).lean().exec(),
    ]);

    const meta = { page, limit, total, pages: Math.ceil(total / limit) };
    return res.json(success(items, "Activity logs retrieved", meta));
  } catch (err) {
    console.error(err);
    return res.status(500).json(apiError("Failed to fetch activity logs", 500, err));
  }
}
