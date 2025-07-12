import { Request, Response } from 'express';
import Symptom from '../models/symptoms';
import { Types } from 'mongoose';

// A-Z helper letters
const validLetters: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const isValidLetter = (char: string): boolean => validLetters.includes(char.toUpperCase());

// GET: A-Z Alphabets
export const getAlphabets = async (req: Request, res: Response) => {
  try {
    res.json(validLetters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alphabets', error });
  }
};

// GET: Symptoms by Letter
export const getSymptomsByLetter = async (req: Request, res: Response) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const symptoms = await Symptom.find(
      { name: new RegExp(`^${letter}`, 'i') },
      { name: 1, description: 1, _id: 1 }
    ).sort({ name: 1 });

    res.json(symptoms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching symptoms', error });
  }
};

// POST: Single symptom by letter
export const createSymptomForLetter = async (req: Request, res: Response) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const { name, description }: { name: string; description?: string } = req.body;

    if (!name || typeof name !== 'string' || !name.trim().toUpperCase().startsWith(letter)) {
      res.status(400).json({
        message: `Symptom name must start with the letter ${letter}`,
        providedName: name || 'No name provided'
      });
      return;
    }

    const newSymptom = new Symptom({
      name: name.trim(),
      description: description?.trim() || ''
    });

    const savedSymptom = await newSymptom.save();
    res.status(201).json(savedSymptom);
  } catch (error) {
    res.status(500).json({ message: 'Error creating symptom for letter', error });
  }
};

// POST: Bulk symptoms for a letter
export const createSymptomsBulk = async (req: Request, res: Response) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const symptoms: Array<{ name: string; description?: string }> = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      res.status(400).json({ message: 'Request body must be a non-empty array of symptoms' });
      return;
    }

    const invalidSymptoms = symptoms.filter(
      s => !s.name || typeof s.name !== 'string' || !s.name.toUpperCase().startsWith(letter)
    );

    if (invalidSymptoms.length > 0) {
      res.status(400).json({
        message: `All symptom names must start with the letter ${letter}`,
        invalidSymptoms: invalidSymptoms.map(s => s.name || 'No name provided')
      });
      return;
    }

    const symptomDocs = symptoms.map(symptom => ({
      name: symptom.name.trim(),
      description: symptom.description?.trim() || ''
    }));

    const savedSymptoms = await Symptom.insertMany(symptomDocs);
    res.status(201).json(savedSymptoms);
  } catch (error) {
    res.status(500).json({ message: 'Error creating symptoms in bulk', error });
  }
};

// PUT: Update symptom by ID
export const updateSymptomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description }: { name?: string; description?: string } = req.body;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid symptom ID' });
      return;
    }

    const existingSymptom = await Symptom.findById(id);
    if (!existingSymptom) {
      res.status(404).json({ message: 'Symptom not found' });
      return;
    }

    const originalLetter = existingSymptom.name.charAt(0).toUpperCase();

    if (name && !name.toUpperCase().startsWith(originalLetter)) {
      res.status(400).json({
        message: `Updated symptom name must start with the letter ${originalLetter}`,
        providedName: name
      });
      return;
    }

    existingSymptom.name = name?.trim() || existingSymptom.name;
    existingSymptom.description = description?.trim() || existingSymptom.description;
    existingSymptom.updatedAt = new Date();

    const updatedSymptom = await existingSymptom.save();
    res.json(updatedSymptom);
  } catch (error) {
    res.status(500).json({ message: 'Error updating symptom', error });
  }
};

// DELETE: Symptom by ID
export const deleteSymptomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Invalid symptom ID' });
      return;
    }

    const deletedSymptom = await Symptom.findByIdAndDelete(id);
    if (!deletedSymptom) {
      res.status(404).json({ message: 'Symptom not found' });
      return;
    }

    res.json({ message: 'Symptom deleted successfully', deletedSymptom });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting symptom', error });
  }
};

// POST: Create all symptoms (A-Z, bulk)
export const createAllSymptoms = async (req: Request, res: Response) => {
  try {
    const symptoms: Array<{ name: string; description?: string }> = req.body;

    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      res.status(400).json({ message: 'Request body must be a non-empty array of symptoms' });
      return;
    }

    const invalidSymptoms = symptoms.filter(
      s => !s.name || typeof s.name !== 'string' || !isValidLetter(s.name.charAt(0))
    );

    if (invalidSymptoms.length > 0) {
      res.status(400).json({
        message: 'All symptom names must start with a letter from A-Z',
        invalidSymptoms: invalidSymptoms.map(s => s.name || 'No name provided')
      });
      return;
    }

    const symptomDocs = symptoms.map(symptom => ({
      name: symptom.name.trim(),
      description: symptom.description?.trim() || ''
    }));

    const savedSymptoms = await Symptom.insertMany(symptomDocs);
    res.status(201).json(savedSymptoms);
  } catch (error) {
    res.status(500).json({ message: 'Error creating all symptoms', error });
  }
};
