import { Request, Response } from 'express';
import { SiteSettingsModel } from '../models/siteSettings';

// POST (Create)
export const createSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await SiteSettingsModel.findOne();
    if (existing) {
      res.status(400).json({ error: "Settings already exist" });
      return;
    }
    const settings = new SiteSettingsModel(req.body);
    await settings.save();
    res.status(201).json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to create settings" });
  }
};

// GET
export const getSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await SiteSettingsModel.findOne();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch site settings" });
  }
};


// PUT (Update)
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updated = await SiteSettingsModel.findOneAndUpdate({}, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update settings" });
  }
};

// DELETE
export const deleteSettings = async (_req: Request, res: Response) => {
  try {
    await SiteSettingsModel.deleteMany({});
    res.json({ message: "Settings deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete settings" });
  }
};
