import { Request, Response } from 'express';
import LooserStock, { ILooserStock } from '../models/fnoloosers';

// Add single or multiple loser stocks
export const addLooserStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ILooserStock[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await LooserStock.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all loser stocks (selected fields only)
export const getLooserStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await LooserStock.find({}, 'name price change icon volume');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get loser stock by ID (excluding selected fields)
export const getLooserStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await LooserStock.findById(req.params.id, '-name -price -change -icon -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update loser stock by ID
export const updateLooserStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await LooserStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete loser stock by ID
export const deleteLooserStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await LooserStock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update loser stock by name
export const updateStockByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await LooserStock.findOneAndUpdate(
      { name: req.params.name },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
