import { Request, Response } from 'express';
import TopLosers, { ITopLoser } from '../models/toploosersModel';

// Create stock(s)
export const createStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ITopLoser[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await TopLosers.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get categories
export const getTopLosers = async (req: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      large: 'large',
      mid: 'mid',
      small: 'small',
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get stocks by category
export const getStocksByCategory = async (
  req: Request<{ category: string }>,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;
    if (!['large', 'mid', 'small'].includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    const stocks = await TopLosers.find({ category }, 'name price change image');
    if (!stocks.length) {
      res.status(404).json({ error: 'No stocks found in this category' });
      return;
    }

    res.status(200).json({ category, stocks });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get stock details
export const getStockDetails = async (
  req: Request<{ category: string; id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { category, id } = req.params;
    if (!['large', 'mid', 'small'].includes(category)) {
      res.status(400).json({ error: 'Invalid category' });
      return;
    }

    const stock = await TopLosers.findOne(
      { _id: id, category },
      '-name -price -change -image -__v'
    );

    if (!stock) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json(stock);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update stock
export const updateStock = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const updated = await TopLosers.findByIdAndUpdate(req.params.id, req.body, {
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

// Delete stock
export const deleteStock = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const deleted = await TopLosers.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Stock not found' });
      return;
    }

    res.status(200).json({ message: 'Stock deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
