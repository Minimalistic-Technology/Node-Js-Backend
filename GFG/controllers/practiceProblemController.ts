import { Request, Response } from 'express';
import PracticeProblem from '../models/practiceProblemModel';

export const createProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProblem = new PracticeProblem(req.body);
    await newProblem.save();
    res.status(201).json(newProblem);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create practice problem' });
  }
};

export const getAllProblems = async (_req: Request, res: Response): Promise<void> => {
  try {
    const problems = await PracticeProblem.find();
    res.status(200).json(problems);
  } catch {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

export const getProblemById = async (req: Request, res: Response): Promise<void> => {
  try {
    const problem = await PracticeProblem.findById(req.params.id);
    if (!problem)  res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch {
    res.status(400).json({ error: 'Invalid ID format' });
  }
};

export const updateProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await PracticeProblem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: 'Problem not found' });
    res.json(updated);
  } catch {
    res.status(400).json({ error: 'Failed to update problem' });
  }
};

export const deleteProblem = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await PracticeProblem.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: 'Problem not found' });
    res.json({ message: 'Problem deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete problem' });
  }
};
