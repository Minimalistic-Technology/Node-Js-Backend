"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchBMI = exports.deleteBMI = exports.updateBMI = exports.getBMIHistory = exports.createBMI = void 0;
const bmi_model_1 = require("../models/bmi.model");
const bmi_utils_1 = require("../utility/bmi.utils");
const createBMI = async (req, res) => {
    try {
        const { userId, weight, height, unit } = req.body;
        const bmi = (0, bmi_utils_1.calculateBMI)(weight, height, unit);
        const category = (0, bmi_utils_1.classifyBMI)(bmi);
        const newEntry = new bmi_model_1.BmiModel({ userId, weight, height, unit, bmi, category });
        const saved = await newEntry.save();
        res.status(201).json(saved);
    }
    catch (err) {
        res.status(500).json({ error: 'BMI creation failed' });
    }
};
exports.createBMI = createBMI;
const getBMIHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await bmi_model_1.BmiModel.find({ userId });
        res.json(history);
    }
    catch (err) {
        res.status(500).json({ error: 'Error fetching history' });
    }
};
exports.getBMIHistory = getBMIHistory;
const updateBMI = async (req, res) => {
    try {
        const { id } = req.params;
        const { weight, height, unit } = req.body;
        const bmi = (0, bmi_utils_1.calculateBMI)(weight, height, unit);
        const category = (0, bmi_utils_1.classifyBMI)(bmi);
        const updated = await bmi_model_1.BmiModel.findByIdAndUpdate(id, { weight, height, unit, bmi, category }, { new: true });
        if (!updated) {
            res.status(404).json({ error: 'Entry not found' });
        }
        res.json(updated);
    }
    catch (err) {
        res.status(500).json({ error: 'Update failed' });
    }
};
exports.updateBMI = updateBMI;
const deleteBMI = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await bmi_model_1.BmiModel.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: 'Entry not found' });
            return;
        }
        res.json({ message: 'Deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Deletion failed' });
    }
};
exports.deleteBMI = deleteBMI;
const batchBMI = async (req, res) => {
    try {
        const { data } = req.body; // array of { userId, height, weight, unit }
        const result = data.map((entry) => {
            const bmi = (0, bmi_utils_1.calculateBMI)(entry.weight, entry.height, entry.unit);
            const category = (0, bmi_utils_1.classifyBMI)(bmi);
            return { ...entry, bmi, category };
        });
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ error: 'Batch processing failed' });
    }
};
exports.batchBMI = batchBMI;
