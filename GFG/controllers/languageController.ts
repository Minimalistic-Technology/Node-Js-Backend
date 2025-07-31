import { Request, Response } from 'express';
import Language from '../models/languageModel';

export const createLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, icon, description } = req.body;
    const language = new Language({ name, icon, description });
    await language.save();
    res.status(201).json(language);
  } catch (err) {
    res.status(400).json({ error: 'Language creation failed', details: err });
  }
};

export const getAllLanguages = async (_req: Request, res: Response): Promise<void> => {
  const languages = await Language.find();
  res.status(200).json(languages);
};

export const getLanguageById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const language = await Language.findById(id);
  if (!language)  res.status(404).json({ error: 'Language not found' });
  res.status(200).json(language);
};

export const updateLanguage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, icon, description } = req.body;

  const language = await Language.findByIdAndUpdate(
    id,
    { name, icon, description },
    { new: true }
  );
  if (!language)  res.status(404).json({ error: 'Language not found' });
  res.status(200).json(language);
};

export const deleteLanguage = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  await Language.findByIdAndDelete(id);
  res.status(200).json({ message: 'Language deleted' });
};
