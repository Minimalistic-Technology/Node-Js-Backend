"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAllSymptoms = exports.deleteSymptomById = exports.updateSymptomById = exports.createSymptomsBulk = exports.createSymptomForLetter = exports.getSymptomsByLetter = exports.getAlphabets = void 0;
const symptoms_1 = __importDefault(require("../../models/hospital/symptoms"));
const mongoose_1 = require("mongoose");
// A-Z helper letters
const validLetters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const isValidLetter = (char) => validLetters.includes(char.toUpperCase());
// GET: A-Z Alphabets
const getAlphabets = async (req, res) => {
    try {
        res.json(validLetters);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alphabets', error });
    }
};
exports.getAlphabets = getAlphabets;
// GET: Symptoms by Letter
const getSymptomsByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const symptoms = await symptoms_1.default.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1, description: 1, _id: 1 }).sort({ name: 1 });
        res.json(symptoms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching symptoms', error });
    }
};
exports.getSymptomsByLetter = getSymptomsByLetter;
// POST: Single symptom by letter
const createSymptomForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const { name, description } = req.body;
        if (!name || typeof name !== 'string' || !name.trim().toUpperCase().startsWith(letter)) {
            res.status(400).json({
                message: `Symptom name must start with the letter ${letter}`,
                providedName: name || 'No name provided'
            });
            return;
        }
        const newSymptom = new symptoms_1.default({
            name: name.trim(),
            description: description?.trim() || ''
        });
        const savedSymptom = await newSymptom.save();
        res.status(201).json(savedSymptom);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating symptom for letter', error });
    }
};
exports.createSymptomForLetter = createSymptomForLetter;
// POST: Bulk symptoms for a letter
const createSymptomsBulk = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const symptoms = req.body;
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            res.status(400).json({ message: 'Request body must be a non-empty array of symptoms' });
            return;
        }
        const invalidSymptoms = symptoms.filter(s => !s.name || typeof s.name !== 'string' || !s.name.toUpperCase().startsWith(letter));
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
        const savedSymptoms = await symptoms_1.default.insertMany(symptomDocs);
        res.status(201).json(savedSymptoms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating symptoms in bulk', error });
    }
};
exports.createSymptomsBulk = createSymptomsBulk;
// PUT: Update symptom by ID
const updateSymptomById = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid symptom ID' });
            return;
        }
        const existingSymptom = await symptoms_1.default.findById(id);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating symptom', error });
    }
};
exports.updateSymptomById = updateSymptomById;
// DELETE: Symptom by ID
const deleteSymptomById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: 'Invalid symptom ID' });
            return;
        }
        const deletedSymptom = await symptoms_1.default.findByIdAndDelete(id);
        if (!deletedSymptom) {
            res.status(404).json({ message: 'Symptom not found' });
            return;
        }
        res.json({ message: 'Symptom deleted successfully', deletedSymptom });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting symptom', error });
    }
};
exports.deleteSymptomById = deleteSymptomById;
// POST: Create all symptoms (A-Z, bulk)
const createAllSymptoms = async (req, res) => {
    try {
        const symptoms = req.body;
        if (!Array.isArray(symptoms) || symptoms.length === 0) {
            res.status(400).json({ message: 'Request body must be a non-empty array of symptoms' });
            return;
        }
        const invalidSymptoms = symptoms.filter(s => !s.name || typeof s.name !== 'string' || !isValidLetter(s.name.charAt(0)));
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
        const savedSymptoms = await symptoms_1.default.insertMany(symptomDocs);
        res.status(201).json(savedSymptoms);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating all symptoms', error });
    }
};
exports.createAllSymptoms = createAllSymptoms;
