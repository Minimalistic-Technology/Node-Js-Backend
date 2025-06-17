import { Request, Response } from 'express';
import TopSectors from '../../models/stocks/topSectorsModel';

// Add single or multiple sectors
export const addTopSectors = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await TopSectors.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sectors
export const getTopSectors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await TopSectors.find();
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update sector by ID
export const updateTopSectors = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await TopSectors.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      res.status(404).json({ error: 'Sector not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete sector by ID
export const deleteTopSectors = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await TopSectors.findByIdAndDelete(req.params.id);

    if (!deleted) {
      res.status(404).json({ error: 'Sector not found' });
      return;
    }

    res.status(200).json({ message: 'Sector deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
