import { Request, Response } from "express";
import { FAQModel } from "../models/faq";

export const createFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const faq = new FAQModel(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (err) {
    res.status(400).json({ error: "Failed to create FAQ" });
  }
};

export const getAllFAQs = async (_req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQModel.find();
    res.json(faqs);
  } catch (err) {
    res.status(500).json({ error: "Failed to get FAQs" });
  }
};

export const updateFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await FAQModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)  res.status(404).json({ error: "FAQ not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update FAQ" });
  }
};

export const deleteFAQ = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await FAQModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "FAQ not found" });
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete FAQ" });
  }
};
