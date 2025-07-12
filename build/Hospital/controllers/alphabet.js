"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllDiseases = exports.deleteDisease = exports.updateDisease = exports.getDiseaseById = exports.createDiseasesBulk = exports.createDisease = exports.getDiseasesByLetter = exports.createAlphabet = exports.getAlphabets = void 0;
const Disease_1 = __importDefault(require("../models/Disease"));
const alphabet_1 = __importDefault(require("../models/alphabet"));
const validLetters = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '#'];
const getAlphabets = async (_req, res) => {
    try {
        const alphabets = await alphabet_1.default.find();
        res.status(200).json({ count: alphabets.length, alphabets });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAlphabets = getAlphabets;
const createAlphabet = async (req, res) => {
    try {
        const { letter } = req.body;
        const upperLetter = letter?.toUpperCase();
        if (!validLetters.includes(upperLetter)) {
            res.status(400).json({ message: 'Invalid letter' });
            return;
        }
        const existing = await alphabet_1.default.findOne({ letter: upperLetter });
        if (existing) {
            res.status(409).json({ message: 'Alphabet already exists' });
            return;
        }
        const alphabet = new alphabet_1.default({ letter: upperLetter });
        const newAlphabet = await alphabet.save();
        res.status(201).json(newAlphabet);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createAlphabet = createAlphabet;
const getDiseasesByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        if (!validLetters.includes(letter)) {
            res.status(400).json({ message: `Invalid letter: ${letter}` });
            return;
        }
        const alphabet = await alphabet_1.default.findOne({ letter });
        if (!alphabet) {
            res.status(404).json({ message: `Alphabet ${letter} not found` });
            return;
        }
        const diseases = await Disease_1.default.find({ alphabet: alphabet._id });
        res.status(200).json({ count: diseases.length, diseases });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDiseasesByLetter = getDiseasesByLetter;
const createDisease = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        if (!validLetters.includes(letter)) {
            res.status(400).json({ message: `Invalid letter: ${letter}` });
            return;
        }
        const { name, see } = req.body;
        const alphabet = await alphabet_1.default.findOne({ letter });
        if (!alphabet) {
            res.status(404).json({ message: `Alphabet ${letter} not found` });
            return;
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
const createDiseasesBulk = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        if (!validLetters.includes(letter)) {
            res.status(400).json({ message: `Invalid letter: ${letter}` });
            return;
        }
        const diseases = req.body.diseases;
        if (!Array.isArray(diseases) || diseases.length === 0) {
            res.status(400).json({ message: 'Invalid input: diseases must be a non-empty array' });
            return;
        }
        const alphabet = await alphabet_1.default.findOne({ letter });
        if (!alphabet) {
            res.status(404).json({ message: `Alphabet ${letter} not found` });
            return;
        }
        const diseaseDocs = diseases.map(d => ({
            alphabet: alphabet._id,
            name: d.name,
            see: d.see || null
        }));
        const newDiseases = await Disease_1.default.insertMany(diseaseDocs);
        res.status(201).json({ count: newDiseases.length, diseases: newDiseases });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createDiseasesBulk = createDiseasesBulk;
const getDiseaseById = async (req, res) => {
    try {
        const disease = await Disease_1.default.findById(req.params.diseaseId).populate('alphabet');
        if (!disease) {
            res.status(404).json({ message: 'Disease not found' });
            return;
        }
        res.status(200).json(disease);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDiseaseById = getDiseaseById;
const updateDisease = async (req, res) => {
    try {
        const disease = await Disease_1.default.findByIdAndUpdate(req.params.diseaseId, req.body, { new: true }).populate('alphabet');
        if (!disease) {
            res.status(404).json({ message: 'Disease not found' });
            return;
        }
        res.status(200).json(disease);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateDisease = updateDisease;
const deleteDisease = async (req, res) => {
    try {
        const disease = await Disease_1.default.findByIdAndDelete(req.params.diseaseId);
        if (!disease) {
            res.status(404).json({ message: 'Disease not found' });
            return;
        }
        res.status(200).json({ message: 'Disease deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDisease = deleteDisease;
const createAllDiseases = async (req, res) => {
    try {
        const diseases = req.body;
        if (!Array.isArray(diseases) || diseases.length === 0) {
            res.status(400).json({ message: 'Request body must be a non-empty array of diseases' });
            return;
        }
        const invalidDiseases = diseases.filter(d => !d.name || !validLetters.includes(d.name.charAt(0).toUpperCase()));
        if (invalidDiseases.length > 0) {
            res.status(400).json({
                message: 'All disease names must start with a letter from A-Z',
                invalidDiseases: invalidDiseases.map(d => d.name || 'No name provided')
            });
            return;
        }
        const alphabets = await alphabet_1.default.find();
        if (alphabets.length === 0) {
            res.status(404).json({ message: 'No alphabets found. Please create alphabets first.' });
            return;
        }
        const alphabetMap = new Map(alphabets.map(a => [a.letter, a._id.toString()]));
        const diseaseDocs = diseases
            .map(d => {
            const letter = d.name.charAt(0).toUpperCase();
            const alphabetId = alphabetMap.get(letter);
            return alphabetId ? {
                alphabet: alphabetId,
                name: d.name,
                see: d.see || null
            } : null;
        })
            .filter((d) => d !== null);
        const savedDiseases = await Disease_1.default.insertMany(diseaseDocs);
        res.status(201).json({ count: savedDiseases.length, diseases: savedDiseases });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating all diseases', error: error.message });
    }
};
exports.createAllDiseases = createAllDiseases;
