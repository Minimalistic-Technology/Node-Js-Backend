import { Request, Response } from 'express';
import Topmarket, { IStock } from '../models/topmarketModel';


export const createStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: IStock[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await Topmarket.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllStocks = async (_req: Request, res: Response): Promise<void> => {
  try {
    const data = await Topmarket.find({}, 'name price change image');
    res.status(200).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const getStockDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await Topmarket.findById(req.params.id, '-name -price -change -image -__v');
    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updateStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Topmarket.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await Topmarket.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }
    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const updateStockByName = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Topmarket.findOneAndUpdate(
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
