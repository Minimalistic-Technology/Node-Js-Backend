import { Request, Response } from 'express';
import GrowwFund, { IGrowwFund } from '../models/growwFund';

// Add single or multiple Groww funds
export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: Partial<IGrowwFund>[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await GrowwFund.insertMany(data);
    res.status(201).json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
};

// Get all Groww funds (selected fields)
export const getTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await GrowwFund.find({}, 'name return tag badge');
    res.status(200).json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
};

// Get a Groww fund by ID (excluding selected fields)
export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const fund = await GrowwFund.findById(req.params.id).select('-__v');
    if (!fund) {
      res.status(404).json({ error: 'Fund not found' });
      return;
    }
    res.status(200).json(fund);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
};

// Update a Groww fund by ID
export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await GrowwFund.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404).json({ error: 'Fund not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
};

// Delete a Groww fund by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await GrowwFund.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Fund not found' });
      return;
    }
    res.status(200).json({ message: 'Fund deleted successfully' });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: message });
  }
};
