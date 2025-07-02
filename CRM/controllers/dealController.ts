import { Request, Response } from "express";
import { DealModel } from "../models/deal";
import { NotificationModel } from "../models/notification";

// Create
export const createDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = new DealModel(req.body);
    await deal.save();

    await NotificationModel.create({
      userId: req.body.owner || "system",
      message: `Deal "${deal.name}" created.`,
      type: "Deal",
    });

    res.status(201).json(deal);
  } catch (err) {
    res.status(400).json({ error: "Failed to create deal" });
  }
};

// Get All
export const getAllDeals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const deals = await DealModel.find();
    res.json(deals);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch deals" });
  }
};

// Get by ID
export const getDealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await DealModel.findById(req.params.id);
    if (!deal)  res.status(404).json({ error: "Deal not found" });
    res.json(deal);
  } catch (err) {
    res.status(500).json({ error: "Failed to get deal" });
  }
};

// Update
export const updateDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await DealModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }

    await NotificationModel.create({
      userId: req.body.owner || "system",
      message: `Deal "${updated.name}" updated.`,
      type: "Deal",
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update deal" });
  }
};

// Delete
export const deleteDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await DealModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }

    await NotificationModel.create({
      userId: "system",
      message: `Deal "${deleted.name}" deleted.`,
      type: "Deal",
    });

    res.json({ message: "Deal deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete deal" });
  }
};
