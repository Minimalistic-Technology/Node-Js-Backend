"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkout = exports.updateWorkout = exports.getWorkouts = exports.createWorkout = void 0;
const Workout_1 = __importDefault(require("../../models/Workout"));
const createWorkout = async (req, res) => {
    try {
        const workout = new Workout_1.default(req.body);
        await workout.save();
        res.status(201).json(workout);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create workout' });
    }
};
exports.createWorkout = createWorkout;
const getWorkouts = async (_req, res) => {
    try {
        const workouts = await Workout_1.default.find();
        res.json(workouts);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch workouts' });
    }
};
exports.getWorkouts = getWorkouts;
const updateWorkout = async (req, res) => {
    try {
        const updated = await Workout_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Workout not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update workout' });
    }
};
exports.updateWorkout = updateWorkout;
const deleteWorkout = async (req, res) => {
    try {
        const deleted = await Workout_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Workout not found' });
        res.json({ message: 'Workout deleted' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete workout' });
    }
};
exports.deleteWorkout = deleteWorkout;
