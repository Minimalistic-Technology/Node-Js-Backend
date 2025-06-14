import { Request, Response } from 'express';
import Lab from '../../models/figma/labmodel';

const EXCLUDED_LETTERS = ['J', 'Q', 'U', 'W', 'X', 'Y'];

// Get all allowed alphabets
export const getAlphabets = async (req: Request, res: Response): Promise<void> => {
  try {
    const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
      .filter(letter => !EXCLUDED_LETTERS.includes(letter));
    res.json(alphabets);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching alphabets', error });
  }
};

// Get lab names starting with a specific letter
export const getLabNamesByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs = await Lab.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1, _id: 1 });
    const labNames = labs.map(lab => ({ id: lab._id, name: lab.name }));
    res.json(labNames);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching lab names', error });
  }
};

// Get labs by letter (full details)
export const getLabsByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs = await Lab.find({ name: new RegExp(`^${letter}`, 'i') });
    res.json(labs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching lab details', error });
  }
};

// Get minimal lab details by ID
export const getLabDetailsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }
    res.json({
      researchArea: lab.researchArea,
      researchers: lab.researchers,
      contact: lab.contact,
      publications: lab.publications,
      createdAt: lab.createdAt,
      updatedAt: lab.updatedAt,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching lab details', error });
  }
};

// Get full lab document by ID
export const getLabById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }
    res.json(lab);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching lab details', error });
  }
};

// Create a new lab (no letter in URL)
export const createLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, researchArea, researchers, contact, publications } = req.body;
    const firstLetter = name?.charAt(0).toUpperCase();
    if (EXCLUDED_LETTERS.includes(firstLetter)) {
      res.status(400).json({ message: `Lab name cannot start with ${firstLetter}` });
    }

    const newLab = new Lab({ name, researchArea, researchers, contact, publications });
    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating lab', error });
  }
};

// Create a lab for a specific letter
export const createLabForLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const { name, researchArea, researchers, contact, publications } = req.body;

    if (EXCLUDED_LETTERS.includes(letter)) {
      res.status(400).json({ message: `Cannot create lab for letter ${letter}` });
    }

    if (!name || !name.toUpperCase().startsWith(letter)) {
      res.status(400).json({ message: `Lab name must start with the letter ${letter}` });
    }

    const newLab = new Lab({ name, researchArea, researchers, contact, publications });
    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating lab for letter', error });
  }
};

// Bulk create labs for a specific letter
export const bulkCreateLabsForLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs = req.body;

    if (EXCLUDED_LETTERS.includes(letter)) {
      res.status(400).json({ message: `Cannot create labs for letter ${letter}` });
    }

    const invalidLabs = labs.filter((lab: any) => !lab.name || !lab.name.toUpperCase().startsWith(letter));
    if (invalidLabs.length > 0) {
       res.status(400).json({ message: `All lab names must start with ${letter}`, invalidLabs });
    }

    const savedLabs = await Lab.insertMany(labs);
    res.status(201).json(savedLabs);
  } catch (error: any) {
    res.status(500).json({ message: 'Error bulk creating labs for letter', error });
  }
};

// Update a lab by ID
export const updateLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, researchArea, researchers, contact, publications } = req.body;

    if (name) {
      const firstLetter = name.charAt(0).toUpperCase();
      if (EXCLUDED_LETTERS.includes(firstLetter)) {
        res.status(400).json({ message: `Lab name cannot start with ${firstLetter}` });
      }
    }

    const updatedLab = await Lab.findByIdAndUpdate(
      req.params.id,
      { name, researchArea, researchers, contact, publications },
      { new: true, runValidators: true }
    );

    if (!updatedLab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }

    res.json(updatedLab);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating lab', error });
  }
};

// Delete a lab by ID
export const deleteLab = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedLab = await Lab.findByIdAndDelete(req.params.id);
    if (!deletedLab) {
      res.status(404).json({ message: 'Lab not found' });
      return;
    }
    res.json({ message: 'Lab deleted successfully', deletedLab });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting lab', error });
  }
};
