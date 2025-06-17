"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestQuotes = exports.createQuote = void 0;
const QuoteBlog_1 = __importDefault(require("../models/QuoteBlog"));
const createQuote = async (req, res) => {
    try {
        const quote = new QuoteBlog_1.default(req.body);
        await quote.save();
        res.status(201).json(quote);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createQuote = createQuote;
const getLatestQuotes = async (req, res) => {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    try {
        const quotes = await QuoteBlog_1.default.find({
            createdAt: { $gte: threeMonthsAgo }
        }).sort({ createdAt: -1 });
        res.json(quotes);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getLatestQuotes = getLatestQuotes;
