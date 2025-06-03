const express = require('express');

const router = express.Router();
const {
  addProductTool,
  getAllProductTools,
  getProductToolById,
  updateProductTool,
  deleteProductTool
} = require('../../controllers/stocks/productToolController');
const {
  addStocksInNews,
  getAllStocksInNews,
  getStockInNewsById,
  updateStocksInNews,
  deleteStocksInNews,
} = require('../../controllers/stocks/stocksInNewsController');


const {
  addMTFStocks,
  getAllMTFStocks,
  getMTFStockById,
  updateMTFStock,
  deleteMTFStock
} = require('../../controllers/stocks/mtfController');
const {
  addMostTradedOnGrow,
  getAllMostTradedOnGrow,
  getMostTradedOnGrowById,
  updateMostTradedOnGrow,
  deleteMostTradedOnGrow
} = require('../../controllers/stocks/mostTradedOnGrowController');

const {
  addTopSectors,
  getTopSectors,
  updateTopSectors,
  deleteTopSectors
} = require('../../controllers/stocks/topSectorsController');

const topGainersController = require('../../controllers/stocks/topGainersController');
const topLosersController = require('../../controllers/stocks/toploosersController');
const topMarketController = require('../../controllers/stocks/topmarketController');


router.post('/topmarket', topMarketController.createStock);
router.get('/topmarket', topMarketController.getAllStocks);
router.get('/topmarket/:id', topMarketController.getStockDetails);
router.patch('/topmarket/:name',topMarketController.updateStockByName);
router.put('/topmarket/:id', topMarketController.updateStock);
router.delete('/topmarket/:id', topMarketController.deleteStock);


router.post('/topgainers', topGainersController.createStock);
router.get('/topgainers', topGainersController.getTopGainers);
router.get('/topgainers/:category', topGainersController.getStocksByCategory);
router.get('/topgainers/:category/:id', topGainersController.getStockDetails);
router.put('/topgainers/:id', topGainersController.updateStock);
router.delete('/topgainers/:id', topGainersController.deleteStock);

router.post('/toplosers', topLosersController.createStock);
router.get('/toplosers', topLosersController.getTopLosers);
router.get('/toplosers/:category', topLosersController.getStocksByCategory);
router.get('/toplosers/:category/:id', topLosersController.getStockDetails);
router.put('/toplosers/:id', topLosersController.updateStock);
router.delete('/toplosers/:id', topLosersController.deleteStock);



router.post('/tools', addProductTool);
router.get('/tools', getAllProductTools);
router.get('/tools/:id', getProductToolById);
router.put('/tools/:id', updateProductTool);
router.delete('/tools/:id', deleteProductTool);

router.post('/stocks-in-news', addStocksInNews);
router.get('/stocks-in-news', getAllStocksInNews);
router.get('/stocks-in-news/:id', getStockInNewsById);
router.put('/stocks-in-news/:id', updateStocksInNews);
router.delete('/stocks-in-news/:id', deleteStocksInNews);


router.post('/mtf', addMTFStocks);
router.get('/mtf', getAllMTFStocks);
router.get('/mtf/:id', getMTFStockById);
router.put('/mtf/:id', updateMTFStock);
router.delete('/mtf/:id', deleteMTFStock);





router.post('/mosttradedongrow', addMostTradedOnGrow);
router.get('/mosttradedongrow', getAllMostTradedOnGrow);
router.get('/mosttradedongrow/:id', getMostTradedOnGrowById);
router.put('/mosttradedongrow/:id', updateMostTradedOnGrow);
router.delete('/mosttradedongrow/:id', deleteMostTradedOnGrow);


router.post('/addtopsectors', addTopSectors);
router.get('/gettopsectors', getTopSectors);
router.put('/updatetopsectors/:id', updateTopSectors);
router.delete('/deletetopsectors/:id', deleteTopSectors);




module.exports = router;
