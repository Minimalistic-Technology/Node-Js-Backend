"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopStock = exports.updateTopStock = exports.getTopStockById = exports.getTopStocks = exports.addTopStocks = void 0;
const growwFund_1 = __importDefault(require("../../models/growwFund"));
// Add single or multiple Groww funds
const addTopStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await growwFund_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addTopStocks = addTopStocks;
// Get all Groww funds (selected fields only)
const getTopStocks = async (_req, res) => {
    try {
        const data = await growwFund_1.default.find({}, 'name price change image');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTopStocks = getTopStocks;
// Get Groww fund by ID (excluding selected fields)
const getTopStockById = async (req, res) => {
    try {
        const stock = await growwFund_1.default.findById(req.params.id, '-name -price -change -image -__v');
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
// Update Groww fund by ID
const updateTopStock = async (req, res) => {
    try {
        const updated = await growwFund_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
// Delete Groww fund by ID
const deleteTopStock = async (req, res) => {
    try {
        const deleted = await growwFund_1.default.findByIdAndDelete(req.params.id);
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
