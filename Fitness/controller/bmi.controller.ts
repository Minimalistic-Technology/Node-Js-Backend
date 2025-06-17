import { Request, Response } from 'express';
import { BmiModel } from '../models/bmi.model';
import { calculateBMI, classifyBMI } from '../utils/bmi.utils';

export const createBMI = async (req: Request, res: Response) => {
  try {
    const { userId, weight, height, unit } = req.body;
    const bmi = calculateBMI(weight, height, unit);
    const category = classifyBMI(bmi);

    const newEntry = new BmiModel({ userId, weight, height, unit, bmi, category });
    const saved = await newEntry.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'BMI creation failed' });
  }
};

export const getBMIHistory = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const history = await BmiModel.find({ userId });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching history' });
  }
};

export const updateBMI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { weight, height, unit } = req.body;

    const bmi = calculateBMI(weight, height, unit);
    const category = classifyBMI(bmi);

    const updated = await BmiModel.findByIdAndUpdate(
      id,
      { weight, height, unit, bmi, category },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Entry not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const deleteBMI = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await BmiModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

export const batchBMI = async (req: Request, res: Response) => {
  try {
    const { data } = req.body; // array of { userId, height, weight, unit }

    const result = data.map((entry: any) => {
      const bmi = calculateBMI(entry.weight, entry.height, entry.unit);
      const category = classifyBMI(bmi);
      return { ...entry, bmi, category };
    });

    res.json(result);
  } catch (err) {
    res.status(400).json({ error: 'Batch processing failed' });
  }
};
