"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgress = exports.updateProgress = exports.getProgress = exports.createProgress = void 0;
const WorkoutProgress_1 = __importDefault(require("../../models/WorkoutProgress"));
const createProgress = async (req, res) => {
    try {
        const progress = new WorkoutProgress_1.default(req.body);
        await progress.save();
        res.status(201).json(progress);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to save workout progress' });
    }
};
exports.createProgress = createProgress;
const getProgress = async (_req, res) => {
    try {
        const progress = await WorkoutProgress_1.default.find();
        res.json(progress);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
};
exports.getProgress = getProgress;
const updateProgress = async (req, res) => {
    try {
        const updated = await WorkoutProgress_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Progress not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update progress' });
    }
};
exports.updateProgress = updateProgress;
const deleteProgress = async (req, res) => {
    try {
        const deleted = await WorkoutProgress_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Progress not found' });
        res.json({ message: 'Progress deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete progress' });
    }
};
exports.deleteProgress = deleteProgress;
