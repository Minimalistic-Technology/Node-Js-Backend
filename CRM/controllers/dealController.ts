import { Request, Response } from "express";
import { DealModel } from "../models/deal";
import { NotificationModel } from "../models/notification";

// Create Deal
export const createDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = new DealModel(req.body);
    await deal.save();

    await NotificationModel.create({
      userId: req.body.owner || "system",
      message: `Deal "${deal.name}" created.`,
      type: "deal",
    });

    res.status(201).json(deal);
  } catch (err) {
    console.error("Create Deal Error:", err);
    res.status(400).json({ error: "Failed to create deal" });
  }
};

// Get All Deals
export const getAllDeals = async (_req: Request, res: Response): Promise<void> => {
  try {
    const deals = await DealModel.find();
    res.status(200).json(deals);
  } catch (err) {
    console.error("Fetch Deals Error:", err);
    res.status(500).json({ error: "Failed to fetch deals" });
  }
};

// Get Deal by ID
export const getDealById = async (req: Request, res: Response): Promise<void> => {
  try {
    const deal = await DealModel.findById(req.params.id);
    if (!deal) {
      res.status(404).json({ error: "Deal not found" });
      return;
    }
    res.status(200).json(deal);
  } catch (err) {
    console.error("Fetch Deal by ID Error:", err);
    res.status(500).json({ error: "Failed to get deal" });
  }
};

// Update Deal
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
      type: "deal",
    });

    res.json(updated);
  } catch (err) {
    console.error("Update Deal Error:", err);
    res.status(400).json({ error: "Failed to update deal" });
  }
};

// Delete Deal
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
      type: "deal",
    });

    res.status(200).json({ message: "Deal deleted" });
  } catch (err) {
    console.error("Delete Deal Error:", err);
    res.status(400).json({ error: "Failed to delete deal" });
  }
};
