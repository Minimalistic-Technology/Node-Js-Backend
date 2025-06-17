import { Request, Response } from 'express';
import GoldPrice from '../../models/GoldPrice';
import moment from 'moment';

export const getTodayPrice = async (req: Request, res: Response): Promise<void> => {
  const today: string = moment().format('YYYY-MM-DD');

  try {
    const price = await GoldPrice.findOne({ date: today });

    if (!price) {
      res.status(404).json({ message: 'No price found for today' });
      return;
    }

    res.json({ date: today, price: price.price });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addPrice = async (req: Request, res: Response): Promise<void> => {
  const { date, price } = req.body;

  if (!date || price == null) {
    res.status(400).json({ error: 'Date and price are required' });
    return;
  }

  try {
    const newPrice = new GoldPrice({ date, price });
    await newPrice.save();
    res.status(201).json(newPrice);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePrice = async (req: Request, res: Response): Promise<void> => {
  const { date } = req.params;
  const { price } = req.body;

  if (price == null) {
    res.status(400).json({ error: 'Price is required' });
    return;
  }

  try {
    const updated = await GoldPrice.findOneAndUpdate(
      { date },
      { price },
      { new: true }
    );

    if (!updated) {
      res.status(404).json({ message: 'Date not found' });
      return;
    }

    res.json({ message: 'Gold price updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
