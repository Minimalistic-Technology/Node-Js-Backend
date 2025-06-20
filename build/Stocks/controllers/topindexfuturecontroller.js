"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopStock = exports.updateTopStock = exports.getTopStockById = exports.getTopStocks = exports.addTopStocks = void 0;
const TopIndexFuture_1 = __importDefault(require("../models/TopIndexFuture"));
// Add single or multiple Top Index Futures
const addTopStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await TopIndexFuture_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addTopStocks = addTopStocks;
// Get all Top Index Futures (selected fields)
const getTopStocks = async (_req, res) => {
    try {
        const data = await TopIndexFuture_1.default.find({}, 'name price change image');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTopStocks = getTopStocks;
// Get Top Index Future by ID
const getTopStockById = async (req, res) => {
    try {
        const stock = await TopIndexFuture_1.default.findById(req.params.id, '-name -price -change -image -__v');
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
// Update Top Index Future by ID
const updateTopStock = async (req, res) => {
    try {
        const updated = await TopIndexFuture_1.default.findByIdAndUpdate(req.params.id, req.body, {
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
// Delete Top Index Future by ID
const deleteTopStock = async (req, res) => {
    try {
        const deleted = await TopIndexFuture_1.default.findByIdAndDelete(req.params.id);
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
