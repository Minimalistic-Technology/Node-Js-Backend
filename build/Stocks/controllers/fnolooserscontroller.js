"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockByName = exports.deleteTopStock = exports.updateTopStock = exports.getTopStockById = exports.getTopStocks = exports.addTopStocks = void 0;
const fnoloosers_1 = __importDefault(require("../models/fnoloosers"));
// Add single or multiple top stocks
const addTopStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await fnoloosers_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};
exports.addTopStocks = addTopStocks;
// Get all top stocks (only selected fields)
const getTopStocks = async (req, res) => {
    try {
        const data = await fnoloosers_1.default.find({}, 'name price change icon volume');
        res.status(200).json(data);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};
exports.getTopStocks = getTopStocks;
// Get top stock by ID (excluding selected fields)
const getTopStockById = async (req, res) => {
    try {
        const stock = await fnoloosers_1.default.findById(req.params.id).select('-__v');
        if (!stock) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.status(200).json(stock);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};
exports.getTopStockById = getTopStockById;
// Update top stock by ID
const updateTopStock = async (req, res) => {
    try {
        const updated = await fnoloosers_1.default.findByIdAndUpdate(req.params.id, req.body, {
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
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};
exports.updateTopStock = updateTopStock;
// Delete top stock by ID
const deleteTopStock = async (req, res) => {
    try {
        const deleted = await fnoloosers_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Stock not found' });
            return;
        }
        res.status(200).json({ message: 'Stock deleted successfully' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};
exports.deleteTopStock = deleteTopStock;
// Update stock by name
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
        const message = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: message });
    }
};
exports.updateStockByName = updateStockByName;
