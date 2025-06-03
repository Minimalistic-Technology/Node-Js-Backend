const express = require('express');
const router = express.Router();
const topfuturecontroller = require('../controllers/topfuturecontroller');
const topindexcontroller = require('../controllers/topindexfuturecontroller');
const indexcontroller = require('../controllers/indexcontroller');
const toptradedcontroller = require('../controllers/toptradedcontroller');
const popularFundController = require('../controllers/popularFundController');
const fnocontroller = require('../controllers/fnocontroller');
const fnolooserscontroller = require('../controllers/fnolooserscontroller');
const growfundcontrroller= require('../controllers/growwFundController');

router.get('/top-stocks', topfuturecontroller.getTopStocks);
router.post('/top-stocks', topfuturecontroller.addTopStocks);
router.get('/top-stocks/:id', topfuturecontroller.getTopStockById);
router.put('/top-stocks/:id',   topfuturecontroller.updateTopStock);
router.delete('/top-stocks/:id', topfuturecontroller.deleteTopStock);

router.get('/topindex', topindexcontroller.getTopStocks);
router.post('/topindex', topindexcontroller.addTopStocks);
router.get('/topindex/:id', topindexcontroller.getTopStockById);
router.put('/topindex/:id',   topindexcontroller.updateTopStock);
router.delete('/topindex/:id', topindexcontroller.deleteTopStock);

router.get('/index', indexcontroller.getTopStocks);
router.post('/index', indexcontroller.addTopStocks);
router.get('/index/:id', indexcontroller.getTopStockById);
router.put('/index/:id',   indexcontroller.updateTopStock);
router.delete('/index/:id', indexcontroller.deleteTopStock);

router.get('/toptraded', toptradedcontroller.getTopStocks);
router.post('/toptraded', toptradedcontroller.addTopStocks);
router.get('/toptraded/:id', toptradedcontroller.getTopStockById);
router.put('/toptraded/:id',   toptradedcontroller.updateTopStock);
router.delete('/toptraded/:id', toptradedcontroller.deleteTopStock);

router.get('/popularfunds', popularFundController.getTopStocks);
router.post('/popularfunds', popularFundController.addTopStocks);
router.get('/popularfunds/:id', popularFundController.getTopStockById);
router.put('/popularfunds/:id',   popularFundController.updateTopStock);
router.delete('/popularfunds/:id', popularFundController.deleteTopStock);

router.get('/fno', fnocontroller.getTopStocks);
router.post('/fno', fnocontroller.addTopStocks);
router.get('/fno/:id', fnocontroller.getTopStockById);
router.put('/fno/:id',   fnocontroller.updateTopStock);
router.patch('/fno/:name',   fnocontroller.updateStockByName);
router.delete('/fno/:id', fnocontroller.deleteTopStock);

router.get('/fnoloosers', fnolooserscontroller.getTopStocks);
router.post('/fnoloosers', fnolooserscontroller.addTopStocks);
router.get('/fnoloosers/:id', fnolooserscontroller.getTopStockById);
router.patch('/fnoloosers/:name',   fnolooserscontroller.updateStockByName);
router.put('/fnoloosers/:id',   fnolooserscontroller.updateTopStock);
router.delete('/fnoloosers/:id', fnolooserscontroller.deleteTopStock);

router.get('/growfund', growfundcontrroller.getTopStocks);
router.post('/growfund', growfundcontrroller.addTopStocks);
router.get('/growfund/:id', growfundcontrroller.getTopStockById);
router.put('/growfund/:id',   growfundcontrroller.updateTopStock);
router.delete('/growfund/:id', growfundcontrroller.deleteTopStock);

module.exports = router;
