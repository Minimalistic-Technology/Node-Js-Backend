import { Request, Response } from 'express';
import Lab, { ILab } from '../models/labmodel';

const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
const validLetters: string[] = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

export const getAlphabets = async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json(validLetters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alphabets', error });
  }
};

export const getLabNamesByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs = await Lab.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1 });
    const labNames = labs.map(lab => ({ id: lab._id, name: lab.name }));
    res.json(labNames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab names', error });
  }
};

export const getLabsByLetter = getLabNamesByLetter as (req: Request, res: Response) => Promise<void>;

export const getLabDetailsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (lab) {
      const { researchArea, researchers, contact, publications, createdAt, updatedAt } = lab;
      res.json({ researchArea, researchers, contact, publications, createdAt, updatedAt });
    } else {
      res.status(404).json({ message: 'Lab not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab details', error });
  }
};

export const getLabById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (lab) res.json(lab);
    else res.status(404).json({ message: 'Lab not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab', error });
  }
};

export const createLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, researchArea, researchers, contact, publications } = req.body;

    if (excludedLetters.includes(name.charAt(0).toUpperCase())) {
      res.status(400).json({ message: `Lab name cannot start with ${name.charAt(0)}` });
      return;
    }

    const newLab = new Lab({ name, researchArea, researchers, contact, publications });
    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab', error });
  }
};

export const createLabForLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const { name, researchArea, researchers, contact, publications } = req.body;

    if (excludedLetters.includes(letter) || !name.toUpperCase().startsWith(letter)) {
      res.status(400).json({ message: `Lab name must start with the letter ${letter}` });
      return;
    }

    const newLab = new Lab({ name, researchArea, researchers, contact, publications });
    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab for letter', error });
  }
};

export const bulkCreateLabsForLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs: ILab[] = req.body;

    if (excludedLetters.includes(letter)) {
      res.status(400).json({ message: `Cannot create labs for letter ${letter}` });
      return;
    }

    const invalidLabs = labs.filter(lab => !lab.name || !lab.name.toUpperCase().startsWith(letter));
    if (invalidLabs.length > 0) {
      res.status(400).json({ message: `Invalid lab names`, invalidLabs });
      return;
    }

    const savedLabs = await Lab.insertMany(labs);
    res.status(201).json(savedLabs);
  } catch (error) {
    res.status(500).json({ message: 'Error bulk creating labs', error });
  }
};

export const updateLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const { name, researchArea, researchers, contact, publications } = req.body;

    if (name && excludedLetters.includes(name.charAt(0).toUpperCase())) {
      res.status(400).json({ message: `Lab name cannot start with ${name.charAt(0)}` });
      return;
    }

    const updatedLab = await Lab.findByIdAndUpdate(
      id,
      { name, researchArea, researchers, contact, publications },
      { new: true, runValidators: true }
    );

    if (updatedLab) res.json(updatedLab);
    else res.status(404).json({ message: 'Lab not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating lab', error });
  }
};

export const deleteLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedLab = await Lab.findByIdAndDelete(req.params.id);
    if (deletedLab) res.json({ message: 'Lab deleted', deletedLab });
    else res.status(404).json({ message: 'Lab not found' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lab', error });
  }
};
