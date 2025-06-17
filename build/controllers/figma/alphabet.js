"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDisease = exports.updateDisease = exports.getDiseaseById = exports.createDiseasesBulk = exports.createDisease = exports.getDiseasesByLetter = exports.createAlphabet = exports.getAlphabets = void 0;
const Disease_1 = __importDefault(require("../../models/figma/Disease"));
const Alphabet_1 = __importDefault(require("../../models/figma/Alphabet"));
// GET: Retrieve all distinct starting letters from Disease collection
const getAlphabets = async (_req, res) => {
    try {
        const alphabets = await Disease_1.default.distinct('letter');
        res.status(200).json({
            count: alphabets.length,
            alphabets
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAlphabets = getAlphabets;
// POST: Create a new alphabet entry
const createAlphabet = async (req, res) => {
    try {
        const { letter } = req.body;
        const validLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
        if (!validLetters.includes(letter?.toUpperCase())) {
            res.status(400).json({ message: 'Invalid letter' });
        }
        const alphabet = new Alphabet_1.default({ letter: letter.toUpperCase() });
        const newAlphabet = await alphabet.save();
        res.status(201).json(newAlphabet);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createAlphabet = createAlphabet;
// GET: Fetch all diseases that belong to a specific letter
const getDiseasesByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const alphabet = await Alphabet_1.default.findOne({ letter });
        if (!alphabet) {
            res.status(404).json({ message: `Alphabet ${letter} not found` });
        }
        const diseases = await Disease_1.default.find({ alphabet: alphabet._id });
        res.status(200).json({
            count: diseases.length,
            diseases
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDiseasesByLetter = getDiseasesByLetter;
// POST: Create a single disease under a specific letter
const createDisease = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const { name, see } = req.body;
        const alphabet = await Alphabet_1.default.findOne({ letter });
        if (!alphabet) {
            res.status(404).json({ message: `Alphabet ${letter} not found` });
        }
        const disease = new Disease_1.default({ alphabet: alphabet._id, name, see });
        const newDisease = await disease.save();
        res.status(201).json(newDisease);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createDisease = createDisease;
// POST: Bulk create diseases under a specific letter
const createDiseasesBulk = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const diseases = req.body.diseases;
        if (!Array.isArray(diseases) || diseases.length === 0) {
            res.status(400).json({ message: 'Invalid input: diseases must be a non-empty array' });
        }
        const alphabet = await Alphabet_1.default.findOne({ letter });
        if (!alphabet) {
            res.status(404).json({ message: `Alphabet ${letter} not found` });
        }
        const diseaseDocs = diseases.map(d => ({
            alphabet: alphabet._id,
            name: d.name,
            see: d.see || null
        }));
        const newDiseases = await Disease_1.default.insertMany(diseaseDocs);
        res.status(201).json({
            count: newDiseases.length,
            diseases: newDiseases
        });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createDiseasesBulk = createDiseasesBulk;
// GET: Fetch a specific disease by ID
const getDiseaseById = async (req, res) => {
    try {
        const disease = await Disease_1.default.findById(req.params.diseaseId).populate('alphabet');
        if (!disease) {
            res.status(404).json({ message: 'Disease not found' });
        }
        res.status(200).json(disease);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDiseaseById = getDiseaseById;
// PUT: Update a specific disease by ID
const updateDisease = async (req, res) => {
    try {
        const updated = await Disease_1.default.findByIdAndUpdate(req.params.diseaseId, req.body, { new: true }).populate('alphabet');
        if (!updated) {
            res.status(404).json({ message: 'Disease not found' });
        }
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateDisease = updateDisease;
// DELETE: Delete a disease by ID
const deleteDisease = async (req, res) => {
    try {
        const deleted = await Disease_1.default.findByIdAndDelete(req.params.diseaseId);
        if (!deleted) {
            res.status(404).json({ message: 'Disease not found' });
        }
        res.status(200).json({ message: 'Disease deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDisease = deleteDisease;
