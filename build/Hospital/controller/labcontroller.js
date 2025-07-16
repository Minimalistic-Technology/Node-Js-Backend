"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLab = exports.updateLab = exports.bulkCreateLabsForLetter = exports.createLabForLetter = exports.createLab = exports.getLabById = exports.getLabDetailsById = exports.getLabsByLetter = exports.getLabNamesByLetter = exports.getAlphabets = void 0;
const labmodel_1 = __importDefault(require("../../models/hospital/labmodel"));
const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
const validLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const getAlphabets = async (_req, res) => {
    try {
        res.json(validLetters);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alphabets', error });
    }
};
exports.getAlphabets = getAlphabets;
const getLabNamesByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const labs = await labmodel_1.default.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1 });
        const labNames = labs.map(lab => ({ id: lab._id, name: lab.name }));
        res.json(labNames);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab names', error });
    }
};
exports.getLabNamesByLetter = getLabNamesByLetter;
exports.getLabsByLetter = exports.getLabNamesByLetter;
const getLabDetailsById = async (req, res) => {
    try {
        const lab = await labmodel_1.default.findById(req.params.id);
        if (lab) {
            const { researchArea, researchers, contact, publications, createdAt, updatedAt } = lab;
            res.json({ researchArea, researchers, contact, publications, createdAt, updatedAt });
        }
        else {
            res.status(404).json({ message: 'Lab not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab details', error });
    }
};
exports.getLabDetailsById = getLabDetailsById;
const getLabById = async (req, res) => {
    try {
        const lab = await labmodel_1.default.findById(req.params.id);
        if (lab)
            res.json(lab);
        else
            res.status(404).json({ message: 'Lab not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab', error });
    }
};
exports.getLabById = getLabById;
const createLab = async (req, res) => {
    try {
        const { name, researchArea, researchers, contact, publications } = req.body;
        if (excludedLetters.includes(name.charAt(0).toUpperCase())) {
            return res.status(400).json({ message: `Lab name cannot start with ${name.charAt(0)}` });
        }
        const newLab = new labmodel_1.default({ name, researchArea, researchers, contact, publications });
        const savedLab = await newLab.save();
        res.status(201).json(savedLab);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating lab', error });
    }
};
exports.createLab = createLab;
const createLabForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const { name, researchArea, researchers, contact, publications } = req.body;
        if (excludedLetters.includes(letter) || !name.toUpperCase().startsWith(letter)) {
            return res.status(400).json({ message: `Lab name must start with the letter ${letter}` });
        }
        const newLab = new labmodel_1.default({ name, researchArea, researchers, contact, publications });
        const savedLab = await newLab.save();
        res.status(201).json(savedLab);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating lab for letter', error });
    }
};
exports.createLabForLetter = createLabForLetter;
const bulkCreateLabsForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const labs = req.body;
        if (excludedLetters.includes(letter)) {
            return res.status(400).json({ message: `Cannot create labs for letter ${letter}` });
        }
        const invalidLabs = labs.filter(lab => !lab.name || !lab.name.toUpperCase().startsWith(letter));
        if (invalidLabs.length > 0) {
            return res.status(400).json({ message: `Invalid lab names`, invalidLabs });
        }
        const savedLabs = await labmodel_1.default.insertMany(labs);
        res.status(201).json(savedLabs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error bulk creating labs', error });
    }
};
exports.bulkCreateLabsForLetter = bulkCreateLabsForLetter;
const updateLab = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, researchArea, researchers, contact, publications } = req.body;
        if (name && excludedLetters.includes(name.charAt(0).toUpperCase())) {
            return res.status(400).json({ message: `Lab name cannot start with ${name.charAt(0)}` });
        }
        const updatedLab = await labmodel_1.default.findByIdAndUpdate(id, { name, researchArea, researchers, contact, publications }, { new: true, runValidators: true });
        if (updatedLab)
            res.json(updatedLab);
        else
            res.status(404).json({ message: 'Lab not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating lab', error });
    }
};
exports.updateLab = updateLab;
const deleteLab = async (req, res) => {
    try {
        const deletedLab = await labmodel_1.default.findByIdAndDelete(req.params.id);
        if (deletedLab)
            res.json({ message: 'Lab deleted', deletedLab });
        else
            res.status(404).json({ message: 'Lab not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting lab', error });
    }
};
exports.deleteLab = deleteLab;
