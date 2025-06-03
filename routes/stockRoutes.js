const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');
const popularFundController = require('../controllers/popularFundController');

router.get('/getIndices', stockController.getIndices);
router.post('/addIndices', stockController.postIndices);
router.put('/updateIndices/:id', stockController.putIndices);
router.delete('/deleteIndices/:id', stockController.deleteIndices);

router.get('/MostTraded', stockController.getMostTraded);
router.post('/addMostTraded', stockController.postMostTraded);
router.put('/updateMostTraded/:id', stockController.putMostTraded);
router.delete('/deleteMostTraded/:id', stockController.deleteMostTraded);

router.get('/investment', stockController.getInvestment);
router.post('/addinvestment', stockController.postInvestment);
router.put('/updateInvestment/:id', stockController.putInvestment);
router.delete('/deleteInvestment/:id', stockController.deleteInvestment);

router.get('/watchlists', stockController.getWatchlists);
router.post('/addwatchlists', stockController.postWatchlist);
router.put('/updateWatchlist/:id', stockController.putWatchlist);
router.delete('/deleteWatchlist/:id', stockController.deleteWatchlist);

router.get('/get', stockController.getFOStocks);
router.post('/add', stockController.postFOStock);
router.put('/updateFOStock/:id', stockController.putFOStock);
router.delete('/delete/:id', stockController.deleteFOStock);

router.get('/getTopIndexFutures', stockController.getTopIndexFutures);
router.post('/addTopIndexFuture', stockController.postTopIndexFuture);
router.put('/updateTopIndexFuture/:id', stockController.putTopIndexFuture);
router.delete('/deleteTopIndexFuture/:id', stockController.deleteTopIndexFuture);



router.post('/addt', stockController.postTopTradedIndexFuture);
router.get('/gett', stockController.getTopTradedIndexFutures);
router.put('/updatet/:id', stockController.putTopTradedIndexFuture);
router.delete('/deletet/:id',stockController.deleteTopTradedIndexFuture);

module.exports = router;
