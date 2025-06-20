"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSchedule = exports.updateSchedule = exports.createSchedule = exports.getScheduleById = exports.getAllSchedules = void 0;
const schedule_1 = __importDefault(require("../models/schedule"));
// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await schedule_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(schedules);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching schedules', error });
    }
};
exports.getAllSchedules = getAllSchedules;
// Get schedule by ID
const getScheduleById = async (req, res) => {
    try {
        const schedule = await schedule_1.default.findById(req.params.id);
        if (!schedule) {
            res.status(404).json({ message: 'Schedule not found' });
            return;
        }
        res.status(200).json(schedule);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching schedule', error });
    }
};
exports.getScheduleById = getScheduleById;
// Create a new schedule
const createSchedule = async (req, res) => {
    try {
        const { days, subject, startTime, endTime, faculty } = req.body;
        // Validate required fields
        if (!days || !subject || !startTime || !endTime || !faculty) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Validate days array
        if (!Array.isArray(days) || days.length === 0) {
            res.status(400).json({ message: 'Days must be a non-empty array' });
            return;
        }
        const newSchedule = new schedule_1.default({
            days,
            subject,
            startTime,
            endTime,
            faculty,
        });
        await newSchedule.save();
        res.status(201).json({ message: 'Schedule created successfully', schedule: newSchedule });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating schedule', error });
    }
};
exports.createSchedule = createSchedule;
// Update a schedule by ID
const updateSchedule = async (req, res) => {
    try {
        const { days, subject, startTime, endTime, faculty } = req.body;
        // Validate days array if provided
        if (days && (!Array.isArray(days) || days.length === 0)) {
            res.status(400).json({ message: 'Days must be a non-empty array' });
            return;
        }
        const updatedSchedule = await schedule_1.default.findByIdAndUpdate(req.params.id, { days, subject, startTime, endTime, faculty }, { new: true, runValidators: true });
        if (!updatedSchedule) {
            res.status(404).json({ message: 'Schedule not found' });
            return;
        }
        res.status(200).json({ message: 'Schedule updated successfully', schedule: updatedSchedule });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating schedule', error });
    }
};
exports.updateSchedule = updateSchedule;
// Delete a schedule by ID
const deleteSchedule = async (req, res) => {
    try {
        const deletedSchedule = await schedule_1.default.findByIdAndDelete(req.params.id);
        if (!deletedSchedule) {
            res.status(404).json({ message: 'Schedule not found' });
            return;
        }
        res.status(200).json({ message: 'Schedule deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting schedule', error });
    }
};
exports.deleteSchedule = deleteSchedule;
