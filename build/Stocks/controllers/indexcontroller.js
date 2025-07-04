"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopStock = exports.updateTopStock = exports.getTopStockById = exports.getTopStocks = exports.addTopStocks = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Indices_1 = __importDefault(require("../models/Indices"));
// Add single or multiple index stocks
const addTopStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await Indices_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addTopStocks = addTopStocks;
// Get all index stocks (selected fields only)
const getTopStocks = async (_req, res) => {
    try {
        const data = await Indices_1.default.find({}, 'name price change image');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTopStocks = getTopStocks;
// Get index stock by ID (excluding specific fields)
const getTopStockById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
        }
        const stock = await Indices_1.default.findById(id, '-name -price -change -image -__v');
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
exports.getTopStockById = getTopStockById;
// Update index stock by ID
const updateTopStock = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
        }
        const updated = await Indices_1.default.findByIdAndUpdate(id, req.body, {
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
exports.updateTopStock = updateTopStock;
// Delete index stock by ID
const deleteTopStock = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid ID format' });
            return;
        }
        const deleted = await Indices_1.default.findByIdAndDelete(id);
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
exports.deleteTopStock = deleteTopStock;
