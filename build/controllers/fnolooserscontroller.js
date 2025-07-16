"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockByName = exports.deleteLooserStock = exports.updateLooserStock = exports.getLooserStockById = exports.getLooserStocks = exports.addLooserStocks = void 0;
const fnoloosers_1 = __importDefault(require("../models/fnoloosers"));
// Add single or multiple loser stocks
const addLooserStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await fnoloosers_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addLooserStocks = addLooserStocks;
// Get all loser stocks (selected fields only)
const getLooserStocks = async (_req, res) => {
    try {
        const data = await fnoloosers_1.default.find({}, 'name price change icon volume');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getLooserStocks = getLooserStocks;
// Get loser stock by ID (excluding selected fields)
const getLooserStockById = async (req, res) => {
    try {
        const stock = await fnoloosers_1.default.findById(req.params.id, '-name -price -change -icon -__v');
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
exports.getLooserStockById = getLooserStockById;
// Update loser stock by ID
const updateLooserStock = async (req, res) => {
    try {
        const updated = await fnoloosers_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
exports.updateLooserStock = updateLooserStock;
// Delete loser stock by ID
const deleteLooserStock = async (req, res) => {
    try {
        const deleted = await fnoloosers_1.default.findByIdAndDelete(req.params.id);
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
exports.deleteLooserStock = deleteLooserStock;
// Update loser stock by name
const updateStockByName = async (req, res) => {
    try {
        const updated = await fnoloosers_1.default.findOneAndUpdate({ name: req.params.name }, req.body, { new: true, runValidators: true });
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
exports.updateStockByName = updateStockByName;
