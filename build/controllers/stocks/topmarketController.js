"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStockByName = exports.deleteStock = exports.updateStock = exports.getStockDetails = exports.getAllStocks = exports.createStock = void 0;
const topmarketModel_1 = __importDefault(require("../../models/stocks/topmarketModel"));
// Create stock(s)
const createStock = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await topmarketModel_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createStock = createStock;
// Get all stocks (basic info only)
const getAllStocks = async (_req, res) => {
    try {
        const data = await topmarketModel_1.default.find({}, 'name price change image');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllStocks = getAllStocks;
// Get full stock details by ID (excluding basic info)
const getStockDetails = async (req, res) => {
    try {
        const stock = await topmarketModel_1.default.findById(req.params.id, '-name -price -change -image -__v');
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
// Update stock by ID
const updateStock = async (req, res) => {
    try {
        const updated = await topmarketModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
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
// Delete stock by ID
const deleteStock = async (req, res) => {
    try {
        const deleted = await topmarketModel_1.default.findByIdAndDelete(req.params.id);
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
// Update stock by name
const updateStockByName = async (req, res) => {
    try {
        const updated = await topmarketModel_1.default.findOneAndUpdate({ name: req.params.name }, req.body, { new: true, runValidators: true });
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
