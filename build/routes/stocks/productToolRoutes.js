"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productToolController_1 = require("../../controllers/stocks/productToolController");
const stocksInNewsController_1 = require("../../controllers/stocks/stocksInNewsController");
const mtfController_1 = require("../../controllers/stocks/mtfController");
const mostTradedOnGrowController_1 = require("../../controllers/stocks/mostTradedOnGrowController");
const topSectorsController_1 = require("../../controllers/stocks/topSectorsController");
const topGainersController_1 = __importDefault(require("../../controllers/stocks/topGainersController"));
const toploosersController_1 = __importDefault(require("../../controllers/stocks/toploosersController"));
const topmarketController_1 = __importDefault(require("../../controllers/stocks/topmarketController"));
const router = express_1.default.Router();
// ----- Top Market Routes -----
router.post('/topmarket', topmarketController_1.default.createStock);
router.get('/topmarket', topmarketController_1.default.getAllStocks);
router.get('/topmarket/:id', topmarketController_1.default.getStockDetails);
router.patch('/topmarket/:name', topmarketController_1.default.updateStockByName);
router.put('/topmarket/:id', topmarketController_1.default.updateStock);
router.delete('/topmarket/:id', topmarketController_1.default.deleteStock);
// ----- Top Gainers Routes -----
router.post('/topgainers', topGainersController_1.default.createStock);
router.get('/topgainers', topGainersController_1.default.getTopGainers);
router.get('/topgainers/:category', topGainersController_1.default.getStocksByCategory);
router.get('/topgainers/:category/:id', topGainersController_1.default.getStockDetails);
router.put('/topgainers/:id', topGainersController_1.default.updateStock);
router.delete('/topgainers/:id', topGainersController_1.default.deleteStock);
// ----- Top Losers Routes -----
router.post('/toplosers', toploosersController_1.default.createStock);
router.get('/toplosers', toploosersController_1.default.getTopLosers);
router.get('/toplosers/:category', toploosersController_1.default.getStocksByCategory);
router.get('/toplosers/:category/:id', toploosersController_1.default.getStockDetails);
router.put('/toplosers/:id', toploosersController_1.default.updateStock);
router.delete('/toplosers/:id', toploosersController_1.default.deleteStock);
// ----- Product Tools -----
router.post('/tools', productToolController_1.addProductTool);
router.get('/tools', productToolController_1.getAllProductTools);
router.get('/tools/:id', productToolController_1.getProductToolById);
router.put('/tools/:id', productToolController_1.updateProductTool);
router.delete('/tools/:id', productToolController_1.deleteProductTool);
// ----- Stocks in News -----
router.post('/stocks-in-news', stocksInNewsController_1.addStocksInNews);
router.get('/stocks-in-news', stocksInNewsController_1.getAllStocksInNews);
router.get('/stocks-in-news/:id', stocksInNewsController_1.getStockInNewsById);
router.put('/stocks-in-news/:id', stocksInNewsController_1.updateStocksInNews);
router.delete('/stocks-in-news/:id', stocksInNewsController_1.deleteStocksInNews);
// ----- MTF Stocks -----
router.post('/mtf', mtfController_1.addMTFStocks);
router.get('/mtf', mtfController_1.getAllMTFStocks);
router.get('/mtf/:id', mtfController_1.getMTFStockById);
router.put('/mtf/:id', mtfController_1.updateMTFStock);
router.delete('/mtf/:id', mtfController_1.deleteMTFStock);
// ----- Most Traded on Grow -----
router.post('/mosttradedongrow', mostTradedOnGrowController_1.addMostTradedOnGrow);
router.get('/mosttradedongrow', mostTradedOnGrowController_1.getAllMostTradedOnGrow);
router.get('/mosttradedongrow/:id', mostTradedOnGrowController_1.getMostTradedOnGrowById);
router.put('/mosttradedongrow/:id', mostTradedOnGrowController_1.updateMostTradedOnGrow);
router.delete('/mosttradedongrow/:id', mostTradedOnGrowController_1.deleteMostTradedOnGrow);
// ----- Top Sectors -----
router.post('/addtopsectors', topSectorsController_1.addTopSectors);
router.get('/gettopsectors', topSectorsController_1.getTopSectors);
router.put('/updatetopsectors/:id', topSectorsController_1.updateTopSectors);
router.delete('/deletetopsectors/:id', topSectorsController_1.deleteTopSectors);
exports.default = router;
