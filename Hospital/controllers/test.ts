import { Request, Response } from 'express';
import { TestModel } from '../models/test';

// Get tests by first letter
export const getTestsByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { letter } = req.params;
    if (!letter || letter.length !== 1 || !/[A-Z]/i.test(letter)) {
      res.status(400).json({ message: 'Invalid letter' });
      return;
    }

    const tests = await TestModel.find({ firstLetter: letter.toUpperCase() }).exec();
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tests', error });
  }
};

// Post multiple tests at once
export const addMultipleTests = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];

    const formatted = data.map(item => ({
      ...item,
      firstLetter: item.name?.charAt(0).toUpperCase() || 'Z',
    }));

    const inserted = await TestModel.insertMany(formatted);
    res.status(201).json(inserted);
  } catch (error) {
    res.status(500).json({ message: 'Error adding tests', error });
  }
};

// Post additional info to an existing test by ID
export const appendToTestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const update = req.body;

    const test = await TestModel.findByIdAndUpdate(id, { $set: update }, { new: true });

    if (!test) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }

    res.json(test);
  } catch (error) {
    res.status(500).json({ message: 'Error updating test', error });
  }
};

// Update test by ID
export const updateTestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const update = req.body;

    const updated = await TestModel.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating test', error });
  }
};

// Delete test by ID
export const deleteTestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await TestModel.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Test not found' });
      return;
    }

    res.json({ message: 'Test deleted', id: deleted._id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting test', error });
  }
};

// Append one or more tests under a specific starting letter
export const appendTestsByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const { letter } = req.params;
    if (!letter || letter.length !== 1 || !/[A-Z]/i.test(letter)) {
      res.status(400).json({ message: 'Invalid letter' });
      return;
    }

    const data = Array.isArray(req.body) ? req.body : [req.body];

    const formatted = data.map(item => ({
      ...item,
      firstLetter: letter.toUpperCase(),
    }));

    const inserted = await TestModel.insertMany(formatted);
    res.status(201).json({ message: `Appended tests to letter ${letter.toUpperCase()}`, inserted });
  } catch (error) {
    res.status(500).json({ message: 'Error appending tests', error });
  }
};
