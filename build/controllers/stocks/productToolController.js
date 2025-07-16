"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProductTool = exports.updateProductTool = exports.getProductToolById = exports.getAllProductTools = exports.addProductTool = void 0;
const productTool_1 = __importDefault(require("../../models/stocks/productTool"));
// Add one or multiple product tools
const addProductTool = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const result = await productTool_1.default.insertMany(data);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.addProductTool = addProductTool;
// Get all product tools
const getAllProductTools = async (_req, res) => {
    try {
        const tools = await productTool_1.default.find();
        res.status(200).json(tools);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getAllProductTools = getAllProductTools;
// Get a product tool by ID
const getProductToolById = async (req, res) => {
    try {
        const tool = await productTool_1.default.findById(req.params.id);
        if (!tool) {
            res.status(404).json({ error: 'Tool not found' });
            return;
        }
        res.status(200).json(tool);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getProductToolById = getProductToolById;
// Update a product tool by ID
const updateProductTool = async (req, res) => {
    try {
        const updated = await productTool_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!updated) {
            res.status(404).json({ error: 'Tool not found' });
            return;
        }
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.updateProductTool = updateProductTool;
// Delete a product tool by ID
const deleteProductTool = async (req, res) => {
    try {
        const deleted = await productTool_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Tool not found' });
            return;
        }
        res.status(200).json({ message: 'Tool deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.deleteProductTool = deleteProductTool;
