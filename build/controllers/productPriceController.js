"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductPrice = exports.updateProductPrice = exports.getAllProductPrices = exports.createProductPrice = void 0;
const ProductPrice_1 = __importDefault(require("../models/ProductPrice"));
const createProductPrice = async (req, res) => {
    try {
        const price = new ProductPrice_1.default(req.body);
        await price.save();
        res.status(201).json(price);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create pricing' });
    }
};
exports.createProductPrice = createProductPrice;
const getAllProductPrices = async (_req, res) => {
    try {
        const prices = await ProductPrice_1.default.find();
        res.json(prices);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch prices' });
    }
};
exports.getAllProductPrices = getAllProductPrices;
const updateProductPrice = async (req, res) => {
    try {
        const updated = await ProductPrice_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Price record not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update price' });
    }
};
exports.updateProductPrice = updateProductPrice;
const deleteProductPrice = async (req, res) => {
    try {
        const deleted = await ProductPrice_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Price record not found' });
        res.json({ message: 'Price record deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete price record' });
    }
};
exports.deleteProductPrice = deleteProductPrice;
