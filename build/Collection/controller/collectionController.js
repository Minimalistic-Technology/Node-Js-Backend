"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCollection = exports.putCollection = exports.postCollection = exports.getCollections = void 0;
const Collection_1 = __importDefault(require("../../models/Collection"));
// GET /collections
const getCollections = async (req, res) => {
    try {
        const data = await Collection_1.default.find();
        res.json(data);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
};
exports.getCollections = getCollections;
// POST /collections
const postCollection = async (req, res) => {
    try {
        const input = req.body;
        if (Array.isArray(input)) {
            const existingCollections = await Collection_1.default.find({ name: { $in: input.map((item) => item.name) } });
            if (existingCollections.length > 0) {
                res.status(400).json({
                    error: 'Some collections already exist',
                    existing: existingCollections.map((item) => item.name),
                });
            }
            const collections = await Collection_1.default.insertMany(input);
            res.status(201).json(collections);
        }
        else {
            const exists = await Collection_1.default.findOne({ name: input.name });
            if (exists) {
                res.status(400).json({ error: 'Collection already exists' });
            }
            const collection = new Collection_1.default(input);
            await collection.save();
            res.status(201).json(collection);
        }
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to add collection(s)', details: err.message });
    }
};
exports.postCollection = postCollection;
// PUT /collections/:id
const putCollection = async (req, res) => {
    try {
        const updated = await Collection_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update collection' });
    }
};
exports.putCollection = putCollection;
// DELETE /collections/:id
const deleteCollection = async (req, res) => {
    try {
        await Collection_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Collection deleted' });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete collection' });
    }
};
exports.deleteCollection = deleteCollection;
