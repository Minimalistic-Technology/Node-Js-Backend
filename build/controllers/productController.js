"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getAllProducts = exports.createProduct = void 0;
const Product_1 = __importDefault(require("../models/Product"));
const createProduct = async (req, res) => {
    try {
        const product = new Product_1.default(req.body);
        await product.save();
        res.status(201).json(product);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create product' });
    }
};
exports.createProduct = createProduct;
const getAllProducts = async (_req, res) => {
    try {
        const products = await Product_1.default.find().limit(10);
        res.json(products);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
exports.getAllProducts = getAllProducts;
const updateProduct = async (req, res) => {
    try {
        const updated = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated)
            return res.status(404).json({ error: 'Product not found' });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update product' });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!deleted)
            return res.status(404).json({ error: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
};
exports.deleteProduct = deleteProduct;
