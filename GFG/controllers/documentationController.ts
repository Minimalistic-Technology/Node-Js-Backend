import { Request, Response } from 'express';
import Documentation from '../models/documentationModel';

export const addSection = async (req: Request, res: Response): Promise<void> => {
  try {
    const section = new Documentation(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(400).json({ error: 'Section creation failed', details: err });
  }
};

export const getAllSections = async (_req: Request, res: Response): Promise<void> => {
  const docs = await Documentation.find();
  res.status(200).json(docs);
};

export const getSectionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const doc = await Documentation.findById(id);
  if (!doc)  res.status(404).json({ error: 'Section not found' });
  res.status(200).json(doc);
};

export const updateSectionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const updated = await Documentation.findByIdAndUpdate(id, req.body, { new: true });
  if (!updated)  res.status(404).json({ error: 'Section not found' });
  res.status(200).json(updated);
};

export const deleteSectionById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await Documentation.findByIdAndDelete(id);
  res.status(200).json({ message: 'Section deleted' });
};

export const addSubtopic = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const section = await Documentation.findById(id);
  if (!section) {
    res.status(404).json({ error: 'Section not found' });
    return;
  }

  section.subtopics.push(req.body);
  await section.save();
  res.status(201).json(section);
};

export const updateSubtopic = async (req: Request, res: Response): Promise<void> => {
  const { id, subId } = req.params;
  const section = await Documentation.findById(id);
  if (!section) {
    res.status(404).json({ error: 'Section not found' });
    return;
  }

  const subIndex = parseInt(subId);
  if (subIndex < 0 || subIndex >= section.subtopics.length) {
     res.status(404).json({ error: 'Subtopic not found' });
     return;
  }

  section.subtopics[subIndex] = req.body;
  await section.save();
  res.status(200).json(section);
};

export const deleteSubtopic = async (req: Request, res: Response): Promise<void> => {
  const { id, subId } = req.params;
  const section = await Documentation.findById(id);
  if (!section) {
    res.status(404).json({ error: 'Section not found' });
    return;
  }

  section.subtopics.splice(parseInt(subId), 1);
  await section.save();
  res.status(200).json({ message: 'Subtopic deleted', section });
};

