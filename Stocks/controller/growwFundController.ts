import { Request, Response } from 'express';
import GrowwFund, { IGrowwFund } from '../../models/growwFund';

// Add single or multiple Groww funds
export const addTopStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IGrowwFund[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await GrowwFund.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all Groww funds (selected fields only)
export const getTopStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await GrowwFund.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get Groww fund by ID (excluding selected fields)
export const getTopStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await GrowwFund.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update Groww fund by ID
export const updateTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await GrowwFund.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Groww fund by ID
export const deleteTopStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await GrowwFund.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
