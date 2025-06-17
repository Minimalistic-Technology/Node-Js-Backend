"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrice = exports.addPrice = exports.getTodayPrice = void 0;
const GoldPrice_1 = __importDefault(require("../models/GoldPrice"));
const moment_1 = __importDefault(require("moment"));
const getTodayPrice = async (req, res) => {
    const today = (0, moment_1.default)().format('YYYY-MM-DD');
    try {
        const price = await GoldPrice_1.default.findOne({ date: today });
        if (!price) {
            res.status(404).json({ message: 'No price found for today' });
            return;
        }
        res.json({ date: today, price: price.price });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getTodayPrice = getTodayPrice;
const addPrice = async (req, res) => {
    const { date, price } = req.body;
    if (!date || price == null) {
        res.status(400).json({ error: 'Date and price are required' });
        return;
    }
    try {
        const newPrice = new GoldPrice_1.default({ date, price });
        await newPrice.save();
        res.status(201).json(newPrice);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.addPrice = addPrice;
const updatePrice = async (req, res) => {
    const { date } = req.params;
    const { price } = req.body;
    if (price == null) {
        res.status(400).json({ error: 'Price is required' });
        return;
    }
    try {
        const updated = await GoldPrice_1.default.findOneAndUpdate({ date }, { price }, { new: true });
        if (!updated) {
            res.status(404).json({ message: 'Date not found' });
            return;
        }
        res.json({ message: 'Gold price updated successfully' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updatePrice = updatePrice;
