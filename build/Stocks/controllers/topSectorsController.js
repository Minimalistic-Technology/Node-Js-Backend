"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopSectors = exports.updateTopSectors = exports.getTopSectors = exports.addTopSectors = void 0;
const topSectorsModel_1 = __importDefault(require("../models/topSectorsModel"));
// Add single or multiple sectors
const addTopSectors = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await topSectorsModel_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addTopSectors = addTopSectors;
// Get all sectors
const getTopSectors = async (_req, res) => {
    try {
        const data = await topSectorsModel_1.default.find();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTopSectors = getTopSectors;
// Update sector by ID
const updateTopSectors = async (req, res) => {
    try {
        const updated = await topSectorsModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!updated) {
            res.status(404).json({ error: 'Sector not found' });
            return;
        }
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateTopSectors = updateTopSectors;
// Delete sector by ID
const deleteTopSectors = async (req, res) => {
    try {
        const deleted = await topSectorsModel_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Sector not found' });
            return;
        }
        res.status(200).json({ message: 'Sector deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteTopSectors = deleteTopSectors;
