"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMTFStock = exports.updateMTFStock = exports.getMTFStockById = exports.getAllMTFStocks = exports.addMTFStocks = void 0;
const mtfModel_1 = __importDefault(require("../../models/stocks/mtfModel"));
// Add single or multiple MTF stocks
const addMTFStocks = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await mtfModel_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addMTFStocks = addMTFStocks;
// Get all MTF stocks (selected fields only)
const getAllMTFStocks = async (_req, res) => {
    try {
        const data = await mtfModel_1.default.find({}, 'name price change image');
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllMTFStocks = getAllMTFStocks;
// Get MTF stock by ID (excluding selected fields)
const getMTFStockById = async (req, res) => {
    try {
        const stock = await mtfModel_1.default.findById(req.params.id, '-name -price -change -image -__v');
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
exports.getMTFStockById = getMTFStockById;
// Update MTF stock by ID
const updateMTFStock = async (req, res) => {
    try {
        const updated = await mtfModel_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
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
exports.updateMTFStock = updateMTFStock;
// Delete MTF stock by ID
const deleteMTFStock = async (req, res) => {
    try {
        const deleted = await mtfModel_1.default.findByIdAndDelete(req.params.id);
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
exports.deleteMTFStock = deleteMTFStock;
