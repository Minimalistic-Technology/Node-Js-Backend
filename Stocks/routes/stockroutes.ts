import express from 'express';

import {
  addProductTool,
  getAllProductTools,
  getProductToolById,
  updateProductTool,
  deleteProductTool
} from '../controllers/productToolController';

import {
  addStocksInNews,
  getAllStocksInNews,
  getStockInNewsById,
  updateStocksInNews,
  deleteStocksInNews,
} from '../controllers/stocksInNewsController';

import {
  addMTFStocks,
  getAllMTFStocks,
  getMTFStockById,
  updateMTFStock,
  deleteMTFStock
} from '../controllers/mtfController';



import {
  addTopSectors,
  getTopSectors,
  updateTopSectors,
  deleteTopSectors
} from '../controllers/topSectorsController';

import {
  createStock,
  getTopLosers,
  getStocksByCategory,
  getStockDetails,
  updateStock,
  deleteStock,
} from '../controllers/toploosersController';

import {
  addMostTradedOnGrow,
  getAllMostTradedOnGrow,
  getMostTradedOnGrowById,
  updateMostTradedOnGrow,
  deleteMostTradedOnGrow,
} from '../controllers/mostTradedOnGrowController';

import * as topGainersController from '../controllers/topGainersController';
import * as topMarketController from '../controllers/topmarketController';
import * as fnocontroller from '../controllers/FOstockcontoller';
import * as fnolooserscontroller from '../controllers/fnolooserscontroller';
import * as growfundcontrroller from '../controllers/growwFundController';
import * as indexcontroller from '../controllers/indexcontroller';
import * as toptradedcontroller from '../controllers/toptradedcontroller';
import * as popularFundController from '../controllers/popularFundController';
import * as topfuturecontroller from '../controllers/topstockfuturecontroller';
import * as topindexcontroller from '../controllers/topindexfuturecontroller';
const router = express.Router();


router.get('/topindex', topindexcontroller.getTopStocks);
router.post('/topindex', topindexcontroller.addTopStocks);
router.get('/topindex/:id', topindexcontroller.getTopStockById);
router.put('/topindex/:id',   topindexcontroller.updateTopStock);
router.delete('/topindex/:id', topindexcontroller.deleteTopStock);


router.get('/top-stocks', topfuturecontroller.getTopStocks);
router.post('/top-stocks', topfuturecontroller.addTopStocks);
router.get('/top-stocks/:id', topfuturecontroller.getTopStockById);
router.put('/top-stocks/:id',   topfuturecontroller.updateTopStock);
router.delete('/top-stocks/:id', topfuturecontroller.deleteTopStock);


router.get('/popularfunds', popularFundController.getTopStocks);
router.post('/popularfunds', popularFundController.addTopStocks);
router.get('/popularfunds/:id', popularFundController.getTopStockById);
router.put('/popularfunds/:id',   popularFundController.updateTopStock);
router.delete('/popularfunds/:id', popularFundController.deleteTopStock);


router.get('/toptraded', toptradedcontroller.getTopStocks);
router.post('/toptraded', toptradedcontroller.addTopStocks);
router.get('/toptraded/:id', toptradedcontroller.getTopStockById);
router.put('/toptraded/:id',   toptradedcontroller.updateTopStock);
router.delete('/toptraded/:id', toptradedcontroller.deleteTopStock);


router.get('/index', indexcontroller.getTopStocks);
router.post('/index', indexcontroller.addTopStocks);
router.get('/index/:id', indexcontroller.getTopStockById);
router.put('/index/:id',   indexcontroller.updateTopStock);
router.delete('/index/:id', indexcontroller.deleteTopStock);


router.get('/growfund', growfundcontrroller.getTopStocks);
router.post('/growfund', growfundcontrroller.addTopStocks);
router.get('/growfund/:id', growfundcontrroller.getTopStockById);
router.put('/growfund/:id',   growfundcontrroller.updateTopStock);
router.delete('/growfund/:id', growfundcontrroller.deleteTopStock);

router.get('/fnoloosers', fnolooserscontroller.getTopStocks);
router.post('/fnoloosers', fnolooserscontroller.addTopStocks);
router.get('/fnoloosers/:id', fnolooserscontroller.getTopStockById);
router.patch('/fnoloosers/:name',   fnolooserscontroller.updateStockByName);
router.put('/fnoloosers/:id',   fnolooserscontroller.updateTopStock);
router.delete('/fnoloosers/:id', fnolooserscontroller.deleteTopStock);


router.get('/fno', fnocontroller.getTopStocks);
router.post('/fno', fnocontroller.addTopStocks);
router.get('/fno/:id', fnocontroller.getTopStockById);
router.put('/fno/:id', fnocontroller.updateTopStock);
router.patch('/fno/:name', fnocontroller.updateStockByName);
router.delete('/fno/:id', fnocontroller.deleteTopStock);


router.post('/mosttradedongrow', addMostTradedOnGrow);
router.get('/mosttradedongrow', getAllMostTradedOnGrow);
router.get('/mosttradedongrow/:id', getMostTradedOnGrowById);
router.put('/mosttradedongrow/:id', updateMostTradedOnGrow);
router.delete('/mosttradedongrow/:id', deleteMostTradedOnGrow);

router.post('/toplosers', createStock);
router.get('/toplosers', getTopLosers);
router.get('/toplosers/:category', getStocksByCategory);
router.get('/toplosers/:category/:id', getStockDetails);
router.put('/toplosers/:id', updateStock);
router.delete('/toplosers/:id', deleteStock);

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
router.post('/tools', addProductTool);
router.get('/tools', getAllProductTools);
router.get('/tools/:id', getProductToolById);
router.put('/tools/:id', updateProductTool);
router.delete('/tools/:id', deleteProductTool);

// Stocks in News
router.post('/stocks-in-news', addStocksInNews);
router.get('/stocks-in-news', getAllStocksInNews);
router.get('/stocks-in-news/:id', getStockInNewsById);
router.put('/stocks-in-news/:id', updateStocksInNews);
router.delete('/stocks-in-news/:id', deleteStocksInNews);

// MTF
router.post('/mtf', addMTFStocks);
router.get('/mtf', getAllMTFStocks);
router.get('/mtf/:id', getMTFStockById);
router.put('/mtf/:id', updateMTFStock);
router.delete('/mtf/:id', deleteMTFStock);

// Most Traded on Grow


// Top Sectors
router.post('/addtopsectors', addTopSectors);
router.get('/gettopsectors', getTopSectors);
router.put('/updatetopsectors/:id', updateTopSectors);
router.delete('/deletetopsectors/:id', deleteTopSectors);

export default router;
