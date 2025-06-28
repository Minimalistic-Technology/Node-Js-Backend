"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTopTradedIndexFuture = exports.putTopTradedIndexFuture = exports.getTopTradedIndexFutures = exports.postTopTradedIndexFuture = exports.deleteTopStockFuture = exports.putTopStockFuture = exports.postTopStockFuture = exports.getTopStockFutures = exports.deleteTopIndexFuture = exports.putTopIndexFuture = exports.postTopIndexFuture = exports.getTopIndexFutures = exports.deleteFOStock = exports.putFOStock = exports.postFOStock = exports.getFOStocks = exports.deleteWatchlist = exports.putWatchlist = exports.postWatchlist = exports.getWatchlists = exports.deleteInvestment = exports.putInvestment = exports.postInvestment = exports.getInvestment = exports.deleteMostTraded = exports.putMostTraded = exports.postMostTraded = exports.getMostTraded = exports.deleteIndices = exports.putIndices = exports.postIndices = exports.getIndices = void 0;
const Index_1 = __importDefault(require("../models/Index"));
const MostTraded_1 = __importDefault(require("../models/MostTraded"));
const Investment_1 = __importDefault(require("../models/Investment"));
const Watchlist_1 = __importDefault(require("../models/Watchlist"));
const FOStock_1 = __importDefault(require("../models/FOStock"));
const TopIndexFuture_1 = __importDefault(require("../models/TopIndexFuture"));
const TopStockFuture_1 = __importDefault(require("../models/TopStockFuture"));
const topTradedIndexFuture_1 = __importDefault(require("../models/topTradedIndexFuture"));
// Generic CRUD Handler
const handleError = (res, message, status = 400) => res.status(status).json({ error: message });
// ----- Index -----
const getIndices = async (_, res) => {
    try {
        const data = await Index_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch indices', 500);
    }
};
exports.getIndices = getIndices;
const postIndices = async (req, res) => {
    try {
        const index = new Index_1.default(req.body);
        await index.save();
        res.status(201).json(index);
    }
    catch {
        handleError(res, 'Failed to add index');
    }
};
exports.postIndices = postIndices;
const putIndices = async (req, res) => {
    try {
        const updated = await Index_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update index');
    }
};
exports.putIndices = putIndices;
const deleteIndices = async (req, res) => {
    try {
        await Index_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Index deleted successfully' });
    }
    catch {
        handleError(res, 'Failed to delete index');
    }
};
exports.deleteIndices = deleteIndices;
// ----- Most Traded -----
const getMostTraded = async (_, res) => {
    try {
        const data = await MostTraded_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch most traded stocks', 500);
    }
};
exports.getMostTraded = getMostTraded;
const postMostTraded = async (req, res) => {
    try {
        const stock = new MostTraded_1.default(req.body);
        await stock.save();
        res.status(201).json(stock);
    }
    catch {
        handleError(res, 'Failed to add most traded stock');
    }
};
exports.postMostTraded = postMostTraded;
const putMostTraded = async (req, res) => {
    try {
        const updated = await MostTraded_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update most traded stock');
    }
};
exports.putMostTraded = putMostTraded;
const deleteMostTraded = async (req, res) => {
    try {
        await MostTraded_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Most traded stock deleted' });
    }
    catch {
        handleError(res, 'Failed to delete most traded stock');
    }
};
exports.deleteMostTraded = deleteMostTraded;
// ----- Investment -----
const getInvestment = async (_, res) => {
    try {
        const data = await Investment_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch investment data', 500);
    }
};
exports.getInvestment = getInvestment;
const postInvestment = async (req, res) => {
    try {
        const investment = new Investment_1.default(req.body);
        await investment.save();
        res.status(201).json(investment);
    }
    catch {
        handleError(res, 'Failed to add investment data');
    }
};
exports.postInvestment = postInvestment;
const putInvestment = async (req, res) => {
    try {
        const updated = await Investment_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update investment data');
    }
};
exports.putInvestment = putInvestment;
const deleteInvestment = async (req, res) => {
    try {
        await Investment_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Investment data deleted' });
    }
    catch {
        handleError(res, 'Failed to delete investment data');
    }
};
exports.deleteInvestment = deleteInvestment;
// ----- Watchlist -----
const getWatchlists = async (_, res) => {
    try {
        const data = await Watchlist_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch watchlists', 500);
    }
};
exports.getWatchlists = getWatchlists;
const postWatchlist = async (req, res) => {
    try {
        const watchlist = new Watchlist_1.default(req.body);
        await watchlist.save();
        res.status(201).json(watchlist);
    }
    catch {
        handleError(res, 'Failed to add watchlist');
    }
};
exports.postWatchlist = postWatchlist;
const putWatchlist = async (req, res) => {
    try {
        const updated = await Watchlist_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update watchlist');
    }
};
exports.putWatchlist = putWatchlist;
const deleteWatchlist = async (req, res) => {
    try {
        await Watchlist_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Watchlist deleted' });
    }
    catch {
        handleError(res, 'Failed to delete watchlist');
    }
};
exports.deleteWatchlist = deleteWatchlist;
// ----- F&O Stock -----
const getFOStocks = async (_, res) => {
    try {
        const data = await FOStock_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch F&O stocks', 500);
    }
};
exports.getFOStocks = getFOStocks;
const postFOStock = async (req, res) => {
    try {
        const stock = new FOStock_1.default(req.body);
        await stock.save();
        res.status(201).json(stock);
    }
    catch {
        handleError(res, 'Failed to add F&O stock');
    }
};
exports.postFOStock = postFOStock;
const putFOStock = async (req, res) => {
    try {
        const updated = await FOStock_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update F&O stock');
    }
};
exports.putFOStock = putFOStock;
const deleteFOStock = async (req, res) => {
    try {
        await FOStock_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'F&O stock deleted' });
    }
    catch {
        handleError(res, 'Failed to delete F&O stock');
    }
};
exports.deleteFOStock = deleteFOStock;
// ----- Top Index Future -----
const getTopIndexFutures = async (_, res) => {
    try {
        const data = await TopIndexFuture_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch top index futures', 500);
    }
};
exports.getTopIndexFutures = getTopIndexFutures;
const postTopIndexFuture = async (req, res) => {
    try {
        const index = new TopIndexFuture_1.default(req.body);
        await index.save();
        res.status(201).json(index);
    }
    catch {
        handleError(res, 'Failed to add index future');
    }
};
exports.postTopIndexFuture = postTopIndexFuture;
const putTopIndexFuture = async (req, res) => {
    try {
        const updated = await TopIndexFuture_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update index future');
    }
};
exports.putTopIndexFuture = putTopIndexFuture;
const deleteTopIndexFuture = async (req, res) => {
    try {
        await TopIndexFuture_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Index future deleted' });
    }
    catch {
        handleError(res, 'Failed to delete index future');
    }
};
exports.deleteTopIndexFuture = deleteTopIndexFuture;
// ----- Top Stock Future -----
const getTopStockFutures = async (_, res) => {
    try {
        const data = await TopStockFuture_1.default.find();
        res.json(data);
    }
    catch {
        handleError(res, 'Failed to fetch top stock futures', 500);
    }
};
exports.getTopStockFutures = getTopStockFutures;
const postTopStockFuture = async (req, res) => {
    try {
        const stock = new TopStockFuture_1.default(req.body);
        await stock.save();
        res.status(201).json(stock);
    }
    catch {
        handleError(res, 'Failed to add stock future');
    }
};
exports.postTopStockFuture = postTopStockFuture;
const putTopStockFuture = async (req, res) => {
    try {
        const updated = await TopStockFuture_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update stock future');
    }
};
exports.putTopStockFuture = putTopStockFuture;
const deleteTopStockFuture = async (req, res) => {
    try {
        await TopStockFuture_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Stock future deleted' });
    }
    catch {
        handleError(res, 'Failed to delete stock future');
    }
};
exports.deleteTopStockFuture = deleteTopStockFuture;
// ----- Top Traded Index Future -----
const postTopTradedIndexFuture = async (req, res) => {
    try {
        const future = new topTradedIndexFuture_1.default(req.body);
        await future.save();
        res.status(201).json(future);
    }
    catch {
        handleError(res, 'Failed to add index future');
    }
};
exports.postTopTradedIndexFuture = postTopTradedIndexFuture;
const getTopTradedIndexFutures = async (_, res) => {
    try {
        const futures = await topTradedIndexFuture_1.default.find();
        res.json(futures);
    }
    catch {
        handleError(res, 'Failed to fetch index futures');
    }
};
exports.getTopTradedIndexFutures = getTopTradedIndexFutures;
const putTopTradedIndexFuture = async (req, res) => {
    try {
        const updated = await topTradedIndexFuture_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    }
    catch {
        handleError(res, 'Failed to update index future');
    }
};
exports.putTopTradedIndexFuture = putTopTradedIndexFuture;
const deleteTopTradedIndexFuture = async (req, res) => {
    try {
        await topTradedIndexFuture_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: 'Index future deleted' });
    }
    catch {
        handleError(res, 'Failed to delete index future');
    }
};
exports.deleteTopTradedIndexFuture = deleteTopTradedIndexFuture;
