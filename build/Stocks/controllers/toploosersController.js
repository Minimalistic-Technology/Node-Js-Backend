"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStock = exports.updateStock = exports.getStockDetails = exports.getStocksByCategory = exports.getTopLosers = exports.createStock = void 0;
const toploosersModel_1 = __importDefault(require("../models/toploosersModel"));
// Create stock(s)
const createStock = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await toploosersModel_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createStock = createStock;
// Get categories
const getTopLosers = async (req, res) => {
    try {
        res.status(200).json({
            large: 'large',
            mid: 'mid',
            small: 'small',
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getTopLosers = getTopLosers;
// Get stocks by category
const getStocksByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        if (!['large', 'mid', 'small'].includes(category)) {
            res.status(400).json({ error: 'Invalid category' });
            return;
        }
        const stocks = await toploosersModel_1.default.find({ category }, 'name price change image');
        if (!stocks.length) {
            res.status(404).json({ error: 'No stocks found in this category' });
            return;
        }
        res.status(200).json({ category, stocks });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getStocksByCategory = getStocksByCategory;
// Get stock details
const getStockDetails = async (req, res) => {
    try {
        const { category, id } = req.params;
        if (!['large', 'mid', 'small'].includes(category)) {
            res.status(400).json({ error: 'Invalid category' });
            return;
        }
        const stock = await toploosersModel_1.default.findOne({ _id: id, category }, '-name -price -change -image -__v');
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
exports.getStockDetails = getStockDetails;
// Update stock
const updateStock = async (req, res) => {
    try {
        const updated = await toploosersModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
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
exports.updateStock = updateStock;
// Delete stock
const deleteStock = async (req, res) => {
    try {
        const deleted = await toploosersModel_1.default.findByIdAndDelete(req.params.id);
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
exports.deleteStock = deleteStock;
