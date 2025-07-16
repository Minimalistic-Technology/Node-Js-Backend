"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMostTradedOnGrow = exports.updateMostTradedOnGrow = exports.getMostTradedOnGrowById = exports.getAllMostTradedOnGrow = exports.addMostTradedOnGrow = void 0;
const mostTradedOnGrowModel_1 = __importDefault(require("../../models/stocks/mostTradedOnGrowModel"));
// Add one or multiple stocks
const addMostTradedOnGrow = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await mostTradedOnGrowModel_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addMostTradedOnGrow = addMostTradedOnGrow;
// Get all stocks with selected fields
const getAllMostTradedOnGrow = async (_req, res) => {
    try {
        const data = await mostTradedOnGrowModel_1.default.find({}, 'name price change image');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllMostTradedOnGrow = getAllMostTradedOnGrow;
// Get stock by ID excluding selected fields
const getMostTradedOnGrowById = async (req, res) => {
    try {
        const stock = await mostTradedOnGrowModel_1.default.findById(req.params.id, '-name -price -change -image -__v');
        if (!stock) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.status(200).json(stock);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getMostTradedOnGrowById = getMostTradedOnGrowById;
// Update stock by ID
const updateMostTradedOnGrow = async (req, res) => {
    try {
        const updated = await mostTradedOnGrowModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateMostTradedOnGrow = updateMostTradedOnGrow;
// Delete stock by ID
const deleteMostTradedOnGrow = async (req, res) => {
    try {
        const deleted = await mostTradedOnGrowModel_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.status(200).json({ message: 'Stock deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteMostTradedOnGrow = deleteMostTradedOnGrow;
