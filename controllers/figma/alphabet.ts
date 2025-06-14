import { Request, Response } from 'express';
import { Types } from 'mongoose';
import DiseaseModel from '../../models/figma/Disease';
import AlphabetModel from '../../models/figma/Alphabet';

// GET: Retrieve all distinct starting letters from Disease collection
export const getAlphabets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const alphabets = await DiseaseModel.distinct('letter');
    res.status(200).json({
      count: alphabets.length,
      alphabets
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Create a new alphabet entry
export const createAlphabet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { letter } = req.body;
    const validLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                          'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];

    if (!validLetters.includes(letter?.toUpperCase())) {
     res.status(400).json({ message: 'Invalid letter' });
    }

    const alphabet = new AlphabetModel({ letter: letter.toUpperCase() });
    const newAlphabet = await alphabet.save();
    res.status(201).json(newAlphabet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET: Fetch all diseases that belong to a specific letter
export const getDiseasesByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const alphabet = await AlphabetModel.findOne({ letter });

    if (!alphabet) {
    res.status(404).json({ message: `Alphabet ${letter} not found` });
    }

    const diseases = await DiseaseModel.find({ alphabet: alphabet._id });
    res.status(200).json({
      count: diseases.length,
      diseases
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// POST: Create a single disease under a specific letter
export const createDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const { name, see } = req.body;

    const alphabet = await AlphabetModel.findOne({ letter });
    if (!alphabet) {
     res.status(404).json({ message: `Alphabet ${letter} not found` });
    }

    const disease = new DiseaseModel({ alphabet: alphabet._id, name, see });
    const newDisease = await disease.save();
    res.status(201).json(newDisease);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// POST: Bulk create diseases under a specific letter
export const createDiseasesBulk = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const diseases = req.body.diseases;

    if (!Array.isArray(diseases) || diseases.length === 0) {
      res.status(400).json({ message: 'Invalid input: diseases must be a non-empty array' });
    }

    const alphabet = await AlphabetModel.findOne({ letter });
    if (!alphabet) {
       res.status(404).json({ message: `Alphabet ${letter} not found` });
    }

    const diseaseDocs = diseases.map(d => ({
      alphabet: alphabet._id,
      name: d.name,
      see: d.see || null
    }));

    const newDiseases = await DiseaseModel.insertMany(diseaseDocs);
    res.status(201).json({
      count: newDiseases.length,
      diseases: newDiseases
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// GET: Fetch a specific disease by ID
export const getDiseaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const disease = await DiseaseModel.findById(req.params.diseaseId).populate('alphabet');
    if (!disease) {
     res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json(disease);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// PUT: Update a specific disease by ID
export const updateDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await DiseaseModel.findByIdAndUpdate(
      req.params.diseaseId,
      req.body,
      { new: true }
    ).populate('alphabet');

    if (!updated) {
     res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// DELETE: Delete a disease by ID
export const deleteDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await DiseaseModel.findByIdAndDelete(req.params.diseaseId);
    if (!deleted) {
     res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json({ message: 'Disease deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
