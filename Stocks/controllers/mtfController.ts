import { Request, Response } from 'express';
import MTFStock, { MTFDocument } from '../models/mtfModel';

// Add one or more MTF stocks
export const addMTFStocks = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: MTFDocument[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await MTFStock.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all MTF stocks (selected fields only)
export const getAllMTFStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await MTFStock.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get MTF stock by ID (excluding some fields)
export const getMTFStockById = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await MTFStock.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
    } else {
      res.status(200).json(stock);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update MTF stock by ID
export const updateMTFStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await MTFStock.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
    } else {
      res.status(200).json(updated);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete MTF stock by ID
export const deleteMTFStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await MTFStock.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
    } else {
      res.status(200).json({ message: 'Stock deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
