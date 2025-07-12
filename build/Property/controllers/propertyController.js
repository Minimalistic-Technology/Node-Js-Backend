"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProperty = exports.updateProperty = exports.getProperties = exports.createProperty = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const createProperty = async (req, res) => {
    try {
        const property = new Property_1.default(req.body);
        await property.save();
        res.status(201).json(property);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create property' });
    }
};
exports.createProperty = createProperty;
const getProperties = async (_req, res) => {
    try {
        const properties = await Property_1.default.find();
        res.json(properties);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
};
exports.getProperties = getProperties;
const updateProperty = async (req, res) => {
    try {
        const property = await Property_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }
        res.json(property);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update property' });
    }
};
exports.updateProperty = updateProperty;
const deleteProperty = async (req, res) => {
    try {
        const property = await Property_1.default.findByIdAndDelete(req.params.id);
        if (!property) {
            res.status(404).json({ error: 'Property not found' });
            return;
        }
        res.json({ message: 'Property deleted' });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete property' });
    }
};
exports.deleteProperty = deleteProperty;
