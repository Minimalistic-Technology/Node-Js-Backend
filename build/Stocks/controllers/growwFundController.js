"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopStock = exports.updateTopStock = exports.getTopStockById = exports.getTopStocks = exports.addTopStocks = void 0;
const growwFund_1 = __importDefault(require("../models/growwFund"));
// Add single or multiple Groww funds
const addTopStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await growwFund_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: message });
    }
};
exports.addTopStocks = addTopStocks;
// Get all Groww funds (selected fields)
const getTopStocks = async (req, res) => {
    try {
        const data = await growwFund_1.default.find({}, 'name return tag badge');
        res.status(200).json(data);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: message });
    }
};
exports.getTopStocks = getTopStocks;
// Get a Groww fund by ID (excluding selected fields)
const getTopStockById = async (req, res) => {
    try {
        const fund = await growwFund_1.default.findById(req.params.id).select('-__v');
        if (!fund) {
            res.status(404).json({ error: 'Fund not found' });
            return;
        }
        res.status(200).json(fund);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: message });
    }
};
exports.getTopStockById = getTopStockById;
// Update a Groww fund by ID
const updateTopStock = async (req, res) => {
    try {
        const updated = await growwFund_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) {
            res.status(404).json({ error: 'Fund not found' });
            return;
        }
        res.status(200).json(updated);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: message });
    }
};
exports.updateTopStock = updateTopStock;
// Delete a Groww fund by ID
const deleteTopStock = async (req, res) => {
    try {
        const deleted = await growwFund_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Fund not found' });
            return;
        }
        res.status(200).json({ message: 'Fund deleted successfully' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({ error: message });
    }
};
exports.deleteTopStock = deleteTopStock;
