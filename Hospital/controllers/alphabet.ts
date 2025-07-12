import { Request, Response } from 'express';
import Disease, { IDisease } from '../models/Disease';
import Alphabet, { IAlphabet } from '../models/alphabet';

// Define a literal type for valid alphabet letters
type ValidLetter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' |
  'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | '#';

const validLetters: ValidLetter[] = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'] as ValidLetter[];

export const getAlphabets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const alphabets = await Alphabet.find();
    res.status(200).json({ count: alphabets.length, alphabets });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAlphabet = async (req: Request, res: Response): Promise<void> => {
  try {
    const { letter } = req.body;
    const upperLetter = letter?.toUpperCase();

    if (!validLetters.includes(upperLetter)) {
      res.status(400).json({ message: 'Invalid letter' });
      return;
    }

    const existing = await Alphabet.findOne({ letter: upperLetter });
    if (existing) {
      res.status(409).json({ message: 'Alphabet already exists' });
      return;
    }

    const alphabet = new Alphabet({ letter: upperLetter });
    const newAlphabet = await alphabet.save();
    res.status(201).json(newAlphabet);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDiseasesByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase() as ValidLetter;

    if (!validLetters.includes(letter)) {
      res.status(400).json({ message: `Invalid letter: ${letter}` });
      return;
    }

    const alphabet = await Alphabet.findOne({ letter });
    if (!alphabet) {
      res.status(404).json({ message: `Alphabet ${letter} not found` });
      return;
    }

    const diseases = await Disease.find({ alphabet: alphabet._id });
    res.status(200).json({ count: diseases.length, diseases });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase() as ValidLetter;

    if (!validLetters.includes(letter)) {
      res.status(400).json({ message: `Invalid letter: ${letter}` });
      return;
    }

    const { name, see } = req.body;
    const alphabet = await Alphabet.findOne({ letter });

    if (!alphabet) {
      res.status(404).json({ message: `Alphabet ${letter} not found` });
      return;
    }

    const disease = new Disease({ alphabet: alphabet._id, name, see });
    const newDisease = await disease.save();
    res.status(201).json(newDisease);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const createDiseasesBulk = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase() as ValidLetter;

    if (!validLetters.includes(letter)) {
      res.status(400).json({ message: `Invalid letter: ${letter}` });
      return;
    }

    const diseases: { name: string; see?: string }[] = req.body.diseases;

    if (!Array.isArray(diseases) || diseases.length === 0) {
      res.status(400).json({ message: 'Invalid input: diseases must be a non-empty array' });
      return;
    }

    const alphabet = await Alphabet.findOne({ letter });
    if (!alphabet) {
      res.status(404).json({ message: `Alphabet ${letter} not found` });
      return;
    }

    const diseaseDocs = diseases.map(d => ({
      alphabet: alphabet._id,
      name: d.name,
      see: d.see || null
    }));

    const newDiseases = await Disease.insertMany(diseaseDocs);
    res.status(201).json({ count: newDiseases.length, diseases: newDiseases });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getDiseaseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const disease = await Disease.findById(req.params.diseaseId).populate('alphabet');
    if (!disease) {
      res.status(404).json({ message: 'Disease not found' });
      return;
    }
    res.status(200).json(disease);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const disease = await Disease.findByIdAndUpdate(
      req.params.diseaseId,
      req.body,
      { new: true }
    ).populate('alphabet');

    if (!disease) {
      res.status(404).json({ message: 'Disease not found' });
      return;
    }
    res.status(200).json(disease);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteDisease = async (req: Request, res: Response): Promise<void> => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.diseaseId);
    if (!disease) {
      res.status(404).json({ message: 'Disease not found' });
      return;
    }
    res.status(200).json({ message: 'Disease deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createAllDiseases = async (req: Request, res: Response): Promise<void> => {
  try {
    const diseases: { name: string; see?: string }[] = req.body;

    if (!Array.isArray(diseases) || diseases.length === 0) {
      res.status(400).json({ message: 'Request body must be a non-empty array of diseases' });
      return;
    }

    const invalidDiseases = diseases.filter(
      d => !d.name || !validLetters.includes(d.name.charAt(0).toUpperCase() as ValidLetter)
    );

    if (invalidDiseases.length > 0) {
      res.status(400).json({
        message: 'All disease names must start with a letter from A-Z',
        invalidDiseases: invalidDiseases.map(d => d.name || 'No name provided')
      });
      return;
    }

    const alphabets = await Alphabet.find();
    if (alphabets.length === 0) {
      res.status(404).json({ message: 'No alphabets found. Please create alphabets first.' });
      return;
    }

    const alphabetMap = new Map<ValidLetter, string>(
      alphabets.map(a => [a.letter as ValidLetter, a._id.toString()])
    );

    const diseaseDocs = diseases
      .map(d => {
        const letter = d.name.charAt(0).toUpperCase() as ValidLetter;
        const alphabetId = alphabetMap.get(letter);
        return alphabetId ? {
          alphabet: alphabetId,
          name: d.name,
          see: d.see || null
        } : null;
      })
      .filter((d): d is { alphabet: string; name: string; see: string | null } => d !== null);

    const savedDiseases = await Disease.insertMany(diseaseDocs);
    res.status(201).json({ count: savedDiseases.length, diseases: savedDiseases });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating all diseases', error: error.message });
  }
};
