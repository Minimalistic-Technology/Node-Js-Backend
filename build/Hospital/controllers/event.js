"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEventById = exports.getAllEvents = void 0;
const event_1 = __importDefault(require("../models/event"));
// GET all events
const getAllEvents = async (req, res) => {
    try {
        const events = await event_1.default.find();
        res.status(200).json(events);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllEvents = getAllEvents;
// GET event by ID
const getEventById = async (req, res) => {
    try {
        const event = await event_1.default.findById(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getEventById = getEventById;
// POST create new event
const createEvent = async (req, res) => {
    try {
        const event = new event_1.default(req.body);
        const newEvent = await event.save();
        res.status(201).json(newEvent);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createEvent = createEvent;
// PUT update event
const updateEvent = async (req, res) => {
    try {
        const event = await event_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json(event);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateEvent = updateEvent;
// DELETE event
const deleteEvent = async (req, res) => {
    try {
        const event = await event_1.default.findByIdAndDelete(req.params.id);
        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }
        res.status(200).json({ message: 'Event deleted' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteEvent = deleteEvent;
