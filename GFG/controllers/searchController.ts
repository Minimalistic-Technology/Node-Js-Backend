import { Request, Response } from 'express';
import SearchEntry from '../models/searchEntryModel';
import Language from '../models/languageModel';
import PracticeProblem from '../models/practiceProblemModel';

export const createSearchEntry = async (req: Request, res: Response): Promise<void> => {
  try {
    const entry = new SearchEntry(req.body);
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create search entry' });
  }
};

export const getAllSearchEntries = async (_req: Request, res: Response): Promise<void> => {
  const entries = await SearchEntry.find();
  res.json(entries);
};

export const getSearchEntryById = async (req: Request, res: Response): Promise<void> => {
  const entry = await SearchEntry.findById(req.params.id);
  if (!entry)  res.status(404).json({ error: 'Search entry not found' });
  res.json(entry);
};

export const updateSearchEntry = async (req: Request, res: Response): Promise<void> => {
  const updated = await SearchEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated)  res.status(404).json({ error: 'Search entry not found' });
  res.json(updated);
};

export const deleteSearchEntry = async (req: Request, res: Response): Promise<void> => {
  const deleted = await SearchEntry.findByIdAndDelete(req.params.id);
  if (!deleted)  res.status(404).json({ error: 'Search entry not found' });
  res.json({ message: 'Entry deleted' });
};

export const search = async (req: Request, res: Response): Promise<void> => {
  const { query } = req.query;
  if (!query || typeof query !== 'string')  res.status(400).json({ error: 'Missing query' });

  const entry = await SearchEntry.findOne({ keyword: { $regex: query, $options: 'i' } });
  if (!entry) {
    res.status(404).json({ error: 'No match found' });
    return;
  }

  let result;
  if (entry.type === 'language') {
    result = await Language.findById(entry.referenceId);
  } else if (entry.type === 'problem') {
    result = await PracticeProblem.findById(entry.referenceId);
  }

  res.json({ type: entry.type, data: result });
};
