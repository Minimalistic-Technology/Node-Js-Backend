"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const topfuturecontroller_1 = __importDefault(require("../controllers/topfuturecontroller"));
const topindexfuturecontroller_1 = __importDefault(require("../controllers/topindexfuturecontroller"));
const indexcontroller_1 = __importDefault(require("../controllers/indexcontroller"));
const toptradedcontroller_1 = __importDefault(require("../controllers/toptradedcontroller"));
const popularFundController_1 = __importDefault(require("../controllers/popularFundController"));
const fnocontroller_1 = __importDefault(require("../controllers/fnocontroller"));
const fnolooserscontroller_1 = __importDefault(require("../controllers/fnolooserscontroller"));
const growwFundController_1 = __importDefault(require("../controllers/growwFundController"));
const router = express_1.default.Router();
// Top Futures
router.get('/top-stocks', topfuturecontroller_1.default.getTopStocks);
router.post('/top-stocks', topfuturecontroller_1.default.addTopStocks);
router.get('/top-stocks/:id', topfuturecontroller_1.default.getTopStockById);
router.put('/top-stocks/:id', topfuturecontroller_1.default.updateTopStock);
router.delete('/top-stocks/:id', topfuturecontroller_1.default.deleteTopStock);
// Top Index Futures
router.get('/topindex', topindexfuturecontroller_1.default.getTopStocks);
router.post('/topindex', topindexfuturecontroller_1.default.addTopStocks);
router.get('/topindex/:id', topindexfuturecontroller_1.default.getTopStockById);
router.put('/topindex/:id', topindexfuturecontroller_1.default.updateTopStock);
router.delete('/topindex/:id', topindexfuturecontroller_1.default.deleteTopStock);
// Index
router.get('/index', indexcontroller_1.default.getTopStocks);
router.post('/index', indexcontroller_1.default.addTopStocks);
router.get('/index/:id', indexcontroller_1.default.getTopStockById);
router.put('/index/:id', indexcontroller_1.default.updateTopStock);
router.delete('/index/:id', indexcontroller_1.default.deleteTopStock);
// Top Traded
router.get('/toptraded', toptradedcontroller_1.default.getTopStocks);
router.post('/toptraded', toptradedcontroller_1.default.addTopStocks);
router.get('/toptraded/:id', toptradedcontroller_1.default.getTopStockById);
router.put('/toptraded/:id', toptradedcontroller_1.default.updateTopStock);
router.delete('/toptraded/:id', toptradedcontroller_1.default.deleteTopStock);
// Popular Funds
router.get('/popularfunds', popularFundController_1.default.getTopStocks);
router.post('/popularfunds', popularFundController_1.default.addTopStocks);
router.get('/popularfunds/:id', popularFundController_1.default.getTopStockById);
router.put('/popularfunds/:id', popularFundController_1.default.updateTopStock);
router.delete('/popularfunds/:id', popularFundController_1.default.deleteTopStock);
// FNO
router.get('/fno', fnocontroller_1.default.getTopStocks);
router.post('/fno', fnocontroller_1.default.addTopStocks);
router.get('/fno/:id', fnocontroller_1.default.getTopStockById);
router.put('/fno/:id', fnocontroller_1.default.updateTopStock);
router.patch('/fno/:name', fnocontroller_1.default.updateStockByName);
router.delete('/fno/:id', fnocontroller_1.default.deleteTopStock);
// FNO Losers
router.get('/fnoloosers', fnolooserscontroller_1.default.getTopStocks);
router.post('/fnoloosers', fnolooserscontroller_1.default.addTopStocks);
router.get('/fnoloosers/:id', fnolooserscontroller_1.default.getTopStockById);
router.patch('/fnoloosers/:name', fnolooserscontroller_1.default.updateStockByName);
router.put('/fnoloosers/:id', fnolooserscontroller_1.default.updateTopStock);
router.delete('/fnoloosers/:id', fnolooserscontroller_1.default.deleteTopStock);
// Groww Fund
router.get('/growfund', growwFundController_1.default.getTopStocks);
router.post('/growfund', growwFundController_1.default.addTopStocks);
router.get('/growfund/:id', growwFundController_1.default.getTopStockById);
router.put('/growfund/:id', growwFundController_1.default.updateTopStock);
router.delete('/growfund/:id', growwFundController_1.default.deleteTopStock);
exports.default = router;
