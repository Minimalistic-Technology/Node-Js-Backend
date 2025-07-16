"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stockController_1 = __importDefault(require("../controllers/stockController"));
const router = express_1.default.Router();
// Indices
router.get('/getIndices', stockController_1.default.getIndices);
router.post('/addIndices', stockController_1.default.postIndices);
router.put('/updateIndices/:id', stockController_1.default.putIndices);
router.delete('/deleteIndices/:id', stockController_1.default.deleteIndices);
// Most Traded
router.get('/MostTraded', stockController_1.default.getMostTraded);
router.post('/addMostTraded', stockController_1.default.postMostTraded);
router.put('/updateMostTraded/:id', stockController_1.default.putMostTraded);
router.delete('/deleteMostTraded/:id', stockController_1.default.deleteMostTraded);
// Investment
router.get('/investment', stockController_1.default.getInvestment);
router.post('/addinvestment', stockController_1.default.postInvestment);
router.put('/updateInvestment/:id', stockController_1.default.putInvestment);
router.delete('/deleteInvestment/:id', stockController_1.default.deleteInvestment);
// Watchlists
router.get('/watchlists', stockController_1.default.getWatchlists);
router.post('/addwatchlists', stockController_1.default.postWatchlist);
router.put('/updateWatchlist/:id', stockController_1.default.putWatchlist);
router.delete('/deleteWatchlist/:id', stockController_1.default.deleteWatchlist);
// FO Stocks
router.get('/get', stockController_1.default.getFOStocks);
router.post('/add', stockController_1.default.postFOStock);
router.put('/updateFOStock/:id', stockController_1.default.putFOStock);
router.delete('/delete/:id', stockController_1.default.deleteFOStock);
// Top Index Futures
router.get('/getTopIndexFutures', stockController_1.default.getTopIndexFutures);
router.post('/addTopIndexFuture', stockController_1.default.postTopIndexFuture);
router.put('/updateTopIndexFuture/:id', stockController_1.default.putTopIndexFuture);
router.delete('/deleteTopIndexFuture/:id', stockController_1.default.deleteTopIndexFuture);
// Top Traded Index Futures
router.get('/gett', stockController_1.default.getTopTradedIndexFutures);
router.post('/addt', stockController_1.default.postTopTradedIndexFuture);
router.put('/updatet/:id', stockController_1.default.putTopTradedIndexFuture);
router.delete('/deletet/:id', stockController_1.default.deleteTopTradedIndexFuture);
exports.default = router;
