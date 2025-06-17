"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLab = exports.updateLab = exports.bulkCreateLabsForLetter = exports.createLabForLetter = exports.createLab = exports.getLabById = exports.getLabDetailsById = exports.getLabsByLetter = exports.getLabNamesByLetter = exports.getAlphabets = void 0;
const labmodel_1 = require("../../models/figma/labmodel");
const EXCLUDED_LETTERS = ['J', 'Q', 'U', 'W', 'X', 'Y'];
// Get all allowed alphabets
const getAlphabets = async (req, res) => {
    try {
        const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
            .filter(letter => !EXCLUDED_LETTERS.includes(letter));
        res.json(alphabets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alphabets', error });
    }
};
exports.getAlphabets = getAlphabets;
// Get lab names starting with a specific letter
const getLabNamesByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const labs = await labmodel_1.Lab.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1, _id: 1 });
        const labNames = labs.map(lab => ({ id: lab._id, name: lab.name }));
        res.json(labNames);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab names', error });
    }
};
exports.getLabNamesByLetter = getLabNamesByLetter;
// Get labs by letter (full details)
const getLabsByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const labs = await labmodel_1.Lab.find({ name: new RegExp(`^${letter}`, 'i') });
        res.json(labs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab details', error });
    }
};
exports.getLabsByLetter = getLabsByLetter;
// Get minimal lab details by ID
const getLabDetailsById = async (req, res) => {
    try {
        const lab = await labmodel_1.Lab.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab details', error });
    }
};
exports.getLabDetailsById = getLabDetailsById;
// Get full lab document by ID
const getLabById = async (req, res) => {
    try {
        const lab = await labmodel_1.Lab.findById(req.params.id);
        if (!lab) {
            res.status(404).json({ message: 'Lab not found' });
            return;
        }
        res.json(lab);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching lab details', error });
    }
};
exports.getLabById = getLabById;
// Create a new lab (no letter in URL)
const createLab = async (req, res) => {
    try {
        const { name, researchArea, researchers, contact, publications } = req.body;
        const firstLetter = name?.charAt(0).toUpperCase();
        if (EXCLUDED_LETTERS.includes(firstLetter)) {
            res.status(400).json({ message: `Lab name cannot start with ${firstLetter}` });
        }
        const newLab = new labmodel_1.Lab({ name, researchArea, researchers, contact, publications });
        const savedLab = await newLab.save();
        res.status(201).json(savedLab);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating lab', error });
    }
};
exports.createLab = createLab;
// Create a lab for a specific letter
const createLabForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const { name, researchArea, researchers, contact, publications } = req.body;
        if (EXCLUDED_LETTERS.includes(letter)) {
            res.status(400).json({ message: `Cannot create lab for letter ${letter}` });
        }
        if (!name || !name.toUpperCase().startsWith(letter)) {
            res.status(400).json({ message: `Lab name must start with the letter ${letter}` });
        }
        const newLab = new labmodel_1.Lab({ name, researchArea, researchers, contact, publications });
        const savedLab = await newLab.save();
        res.status(201).json(savedLab);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating lab for letter', error });
    }
};
exports.createLabForLetter = createLabForLetter;
// Bulk create labs for a specific letter
const bulkCreateLabsForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const labs = req.body;
        if (EXCLUDED_LETTERS.includes(letter)) {
            res.status(400).json({ message: `Cannot create labs for letter ${letter}` });
        }
        const invalidLabs = labs.filter((lab) => !lab.name || !lab.name.toUpperCase().startsWith(letter));
        if (invalidLabs.length > 0) {
            res.status(400).json({ message: `All lab names must start with ${letter}`, invalidLabs });
        }
        const savedLabs = await labmodel_1.Lab.insertMany(labs);
        res.status(201).json(savedLabs);
    }
    catch (error) {
        res.status(500).json({ message: 'Error bulk creating labs for letter', error });
    }
};
exports.bulkCreateLabsForLetter = bulkCreateLabsForLetter;
// Update a lab by ID
const updateLab = async (req, res) => {
    try {
        const { name, researchArea, researchers, contact, publications } = req.body;
        if (name) {
            const firstLetter = name.charAt(0).toUpperCase();
            if (EXCLUDED_LETTERS.includes(firstLetter)) {
                res.status(400).json({ message: `Lab name cannot start with ${firstLetter}` });
            }
        }
        const updatedLab = await labmodel_1.Lab.findByIdAndUpdate(req.params.id, { name, researchArea, researchers, contact, publications }, { new: true, runValidators: true });
        if (!updatedLab) {
            res.status(404).json({ message: 'Lab not found' });
            return;
        }
        res.json(updatedLab);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating lab', error });
    }
};
exports.updateLab = updateLab;
// Delete a lab by ID
const deleteLab = async (req, res) => {
    try {
        const deletedLab = await labmodel_1.Lab.findByIdAndDelete(req.params.id);
        if (!deletedLab) {
            res.status(404).json({ message: 'Lab not found' });
            return;
        }
        res.json({ message: 'Lab deleted successfully', deletedLab });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting lab', error });
    }
};
exports.deleteLab = deleteLab;
