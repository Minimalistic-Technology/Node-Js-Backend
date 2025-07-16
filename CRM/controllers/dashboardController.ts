import { Request, Response } from "express";
import { LeadModel } from "../models/lead";
import { MeetingModel } from "../models/meeting";
import { TaskModel } from "../models/task";
import { DealModel } from "../models/deal";

export const getDashboardData = async (req: Request, res: Response) => {
  try {
    const [leads, meetings, tasks, deals] = await Promise.all([
      LeadModel.find(),
      MeetingModel.find(),
      TaskModel.find(),
      DealModel.find()
    ]);

    res.json({
      leads,
      meetings,
      tasks,
      deals
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};
