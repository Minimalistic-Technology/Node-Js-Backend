"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productToolController_1 = require("../controllers/productToolController");
const stocksInNewsController_1 = require("../controllers/stocksInNewsController");
const mtfController_1 = require("../controllers/mtfController");
const topSectorsController_1 = require("../controllers/topSectorsController");
const toploosersController_1 = require("../controllers/toploosersController");
const mostTradedOnGrowController_1 = require("../controllers/mostTradedOnGrowController");
const topGainersController = __importStar(require("../controllers/topGainersController"));
const topMarketController = __importStar(require("../controllers/topmarketController"));
const fnocontroller = __importStar(require("../controllers/FOstockcontoller"));
const fnolooserscontroller = __importStar(require("../controllers/fnolooserscontroller"));
const growfundcontrroller = __importStar(require("../controllers/growwFundController"));
const indexcontroller = __importStar(require("../controllers/indexcontroller"));
const toptradedcontroller = __importStar(require("../controllers/toptradedcontroller"));
const popularFundController = __importStar(require("../controllers/popularFundController"));
const topfuturecontroller = __importStar(require("../controllers/topstockfuturecontroller"));
const topindexcontroller = __importStar(require("../controllers/topindexfuturecontroller"));
const router = express_1.default.Router();
router.get('/topindex', topindexcontroller.getTopStocks);
router.post('/topindex', topindexcontroller.addTopStocks);
router.get('/topindex/:id', topindexcontroller.getTopStockById);
router.put('/topindex/:id', topindexcontroller.updateTopStock);
router.delete('/topindex/:id', topindexcontroller.deleteTopStock);
router.get('/top-stocks', topfuturecontroller.getTopStocks);
router.post('/top-stocks', topfuturecontroller.addTopStocks);
router.get('/top-stocks/:id', topfuturecontroller.getTopStockById);
router.put('/top-stocks/:id', topfuturecontroller.updateTopStock);
router.delete('/top-stocks/:id', topfuturecontroller.deleteTopStock);
router.get('/popularfunds', popularFundController.getTopStocks);
router.post('/popularfunds', popularFundController.addTopStocks);
router.get('/popularfunds/:id', popularFundController.getTopStockById);
router.put('/popularfunds/:id', popularFundController.updateTopStock);
router.delete('/popularfunds/:id', popularFundController.deleteTopStock);
router.get('/toptraded', toptradedcontroller.getTopStocks);
router.post('/toptraded', toptradedcontroller.addTopStocks);
router.get('/toptraded/:id', toptradedcontroller.getTopStockById);
router.put('/toptraded/:id', toptradedcontroller.updateTopStock);
router.delete('/toptraded/:id', toptradedcontroller.deleteTopStock);
router.get('/index', indexcontroller.getTopStocks);
router.post('/index', indexcontroller.addTopStocks);
router.get('/index/:id', indexcontroller.getTopStockById);
router.put('/index/:id', indexcontroller.updateTopStock);
router.delete('/index/:id', indexcontroller.deleteTopStock);
router.get('/growfund', growfundcontrroller.getTopStocks);
router.post('/growfund', growfundcontrroller.addTopStocks);
router.get('/growfund/:id', growfundcontrroller.getTopStockById);
router.put('/growfund/:id', growfundcontrroller.updateTopStock);
router.delete('/growfund/:id', growfundcontrroller.deleteTopStock);
router.get('/fnoloosers', fnolooserscontroller.getTopStocks);
router.post('/fnoloosers', fnolooserscontroller.addTopStocks);
router.get('/fnoloosers/:id', fnolooserscontroller.getTopStockById);
router.patch('/fnoloosers/:name', fnolooserscontroller.updateStockByName);
router.put('/fnoloosers/:id', fnolooserscontroller.updateTopStock);
router.delete('/fnoloosers/:id', fnolooserscontroller.deleteTopStock);
router.get('/fno', fnocontroller.getTopStocks);
router.post('/fno', fnocontroller.addTopStocks);
router.get('/fno/:id', fnocontroller.getTopStockById);
router.put('/fno/:id', fnocontroller.updateTopStock);
router.patch('/fno/:name', fnocontroller.updateStockByName);
router.delete('/fno/:id', fnocontroller.deleteTopStock);
router.post('/mosttradedongrow', mostTradedOnGrowController_1.addMostTradedOnGrow);
router.get('/mosttradedongrow', mostTradedOnGrowController_1.getAllMostTradedOnGrow);
router.get('/mosttradedongrow/:id', mostTradedOnGrowController_1.getMostTradedOnGrowById);
router.put('/mosttradedongrow/:id', mostTradedOnGrowController_1.updateMostTradedOnGrow);
router.delete('/mosttradedongrow/:id', mostTradedOnGrowController_1.deleteMostTradedOnGrow);
router.post('/toplosers', toploosersController_1.createStock);
router.get('/toplosers', toploosersController_1.getTopLosers);
router.get('/toplosers/:category', toploosersController_1.getStocksByCategory);
router.get('/toplosers/:category/:id', toploosersController_1.getStockDetails);
router.put('/toplosers/:id', toploosersController_1.updateStock);
router.delete('/toplosers/:id', toploosersController_1.deleteStock);
// Top Market
router.post('/topmarket', topMarketController.createStock);
router.get('/topmarket', topMarketController.getAllStocks);
router.get('/topmarket/:id', topMarketController.getStockDetails);
router.patch('/topmarket/:name', topMarketController.updateStockByName);
router.put('/topmarket/:id', topMarketController.updateStock);
router.delete('/topmarket/:id', topMarketController.deleteStock);
// Top Gainers
router.post('/topgainers', topGainersController.createStock);
router.get('/topgainers', topGainersController.getTopGainers);
router.get('/topgainers/:category', topGainersController.getStocksByCategory);
router.get('/topgainers/:category/:id', topGainersController.getStockDetails);
router.put('/topgainers/:id', topGainersController.updateStock);
router.delete('/topgainers/:id', topGainersController.deleteStock);
// Tools
router.post('/tools', productToolController_1.addProductTool);
router.get('/tools', productToolController_1.getAllProductTools);
router.get('/tools/:id', productToolController_1.getProductToolById);
router.put('/tools/:id', productToolController_1.updateProductTool);
router.delete('/tools/:id', productToolController_1.deleteProductTool);
// Stocks in News
router.post('/stocks-in-news', stocksInNewsController_1.addStocksInNews);
router.get('/stocks-in-news', stocksInNewsController_1.getAllStocksInNews);
router.get('/stocks-in-news/:id', stocksInNewsController_1.getStockInNewsById);
router.put('/stocks-in-news/:id', stocksInNewsController_1.updateStocksInNews);
router.delete('/stocks-in-news/:id', stocksInNewsController_1.deleteStocksInNews);
// MTF
router.post('/mtf', mtfController_1.addMTFStocks);
router.get('/mtf', mtfController_1.getAllMTFStocks);
router.get('/mtf/:id', mtfController_1.getMTFStockById);
router.put('/mtf/:id', mtfController_1.updateMTFStock);
router.delete('/mtf/:id', mtfController_1.deleteMTFStock);
// Most Traded on Grow
// Top Sectors
router.post('/addtopsectors', topSectorsController_1.addTopSectors);
router.get('/gettopsectors', topSectorsController_1.getTopSectors);
router.put('/updatetopsectors/:id', topSectorsController_1.updateTopSectors);
router.delete('/deletetopsectors/:id', topSectorsController_1.deleteTopSectors);
exports.default = router;
