import express, { Router } from 'express';

import {
  addProductTool,
  getAllProductTools,
  getProductToolById,
  updateProductTool,
  deleteProductTool
} from '../../controllers/stocks/productToolController';

import {
  addStocksInNews,
  getAllStocksInNews,
  getStockInNewsById,
  updateStocksInNews,
  deleteStocksInNews
} from '../../controllers/stocks/stocksInNewsController';

import {
  addMTFStocks,
  getAllMTFStocks,
  getMTFStockById,
  updateMTFStock,
  deleteMTFStock
} from '../../controllers/stocks/mtfController';

import {
  addMostTradedOnGrow,
  getAllMostTradedOnGrow,
  getMostTradedOnGrowById,
  updateMostTradedOnGrow,
  deleteMostTradedOnGrow
} from '../../controllers/stocks/mostTradedOnGrowController';

import {
  addTopSectors,
  getTopSectors,
  updateTopSectors,
  deleteTopSectors
} from '../../controllers/stocks/topSectorsController';

import topGainersController from '../../controllers/stocks/topGainersController';
import topLosersController from '../../controllers/stocks/toploosersController';
import topMarketController from '../../controllers/stocks/topmarketController';

const router: Router = express.Router();

// ----- Top Market Routes -----
router.post('/topmarket', topMarketController.createStock);
router.get('/topmarket', topMarketController.getAllStocks);
router.get('/topmarket/:id', topMarketController.getStockDetails);
router.patch('/topmarket/:name', topMarketController.updateStockByName);
router.put('/topmarket/:id', topMarketController.updateStock);
router.delete('/topmarket/:id', topMarketController.deleteStock);

// ----- Top Gainers Routes -----
router.post('/topgainers', topGainersController.createStock);
router.get('/topgainers', topGainersController.getTopGainers);
router.get('/topgainers/:category', topGainersController.getStocksByCategory);
router.get('/topgainers/:category/:id', topGainersController.getStockDetails);
router.put('/topgainers/:id', topGainersController.updateStock);
router.delete('/topgainers/:id', topGainersController.deleteStock);

// ----- Top Losers Routes -----
router.post('/toplosers', topLosersController.createStock);
router.get('/toplosers', topLosersController.getTopLosers);
router.get('/toplosers/:category', topLosersController.getStocksByCategory);
router.get('/toplosers/:category/:id', topLosersController.getStockDetails);
router.put('/toplosers/:id', topLosersController.updateStock);
router.delete('/toplosers/:id', topLosersController.deleteStock);

// ----- Product Tools -----
router.post('/tools', addProductTool);
router.get('/tools', getAllProductTools);
router.get('/tools/:id', getProductToolById);
router.put('/tools/:id', updateProductTool);
router.delete('/tools/:id', deleteProductTool);

// ----- Stocks in News -----
router.post('/stocks-in-news', addStocksInNews);
router.get('/stocks-in-news', getAllStocksInNews);
router.get('/stocks-in-news/:id', getStockInNewsById);
router.put('/stocks-in-news/:id', updateStocksInNews);
router.delete('/stocks-in-news/:id', deleteStocksInNews);

// ----- MTF Stocks -----
router.post('/mtf', addMTFStocks);
router.get('/mtf', getAllMTFStocks);
router.get('/mtf/:id', getMTFStockById);
router.put('/mtf/:id', updateMTFStock);
router.delete('/mtf/:id', deleteMTFStock);

// ----- Most Traded on Grow -----
router.post('/mosttradedongrow', addMostTradedOnGrow);
router.get('/mosttradedongrow', getAllMostTradedOnGrow);
router.get('/mosttradedongrow/:id', getMostTradedOnGrowById);
router.put('/mosttradedongrow/:id', updateMostTradedOnGrow);
router.delete('/mosttradedongrow/:id', deleteMostTradedOnGrow);

// ----- Top Sectors -----
router.post('/addtopsectors', addTopSectors);
router.get('/gettopsectors', getTopSectors);
router.put('/updatetopsectors/:id', updateTopSectors);
router.delete('/deletetopsectors/:id', deleteTopSectors);

export default router;
