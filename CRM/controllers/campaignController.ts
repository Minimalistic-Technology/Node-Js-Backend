import { Request, Response } from 'express';
import { CampaignModel } from '../models/campaign';

// Create
export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await CampaignModel.create(req.body);
    res.status(201).json(campaign);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create campaign' });
  }
};

// Read all
export const getCampaigns = async (_req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await CampaignModel.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};

// Read one
export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await CampaignModel.findById(req.params.id);
    if (!campaign) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving campaign' });
  }
};

// Update
export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await CampaignModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update campaign' });
  }
};

// Delete
export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await CampaignModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Campaign not found' });
      return;
    }
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
};
