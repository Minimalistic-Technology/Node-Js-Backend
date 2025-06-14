import express, { Router } from 'express';
import topfuturecontroller from '../controllers/topfuturecontroller';
import topindexcontroller from '../controllers/topindexfuturecontroller';
import indexcontroller from '../controllers/indexcontroller';
import toptradedcontroller from '../controllers/toptradedcontroller';
import popularFundController from '../controllers/popularFundController';
import fnocontroller from '../controllers/fnocontroller';
import fnolooserscontroller from '../controllers/fnolooserscontroller';
import growfundcontroller from '../controllers/growwFundController';

const router: Router = express.Router();

// Top Futures
router.get('/top-stocks', topfuturecontroller.getTopStocks);
router.post('/top-stocks', topfuturecontroller.addTopStocks);
router.get('/top-stocks/:id', topfuturecontroller.getTopStockById);
router.put('/top-stocks/:id', topfuturecontroller.updateTopStock);
router.delete('/top-stocks/:id', topfuturecontroller.deleteTopStock);

// Top Index Futures
router.get('/topindex', topindexcontroller.getTopStocks);
router.post('/topindex', topindexcontroller.addTopStocks);
router.get('/topindex/:id', topindexcontroller.getTopStockById);
router.put('/topindex/:id', topindexcontroller.updateTopStock);
router.delete('/topindex/:id', topindexcontroller.deleteTopStock);

// Index
router.get('/index', indexcontroller.getTopStocks);
router.post('/index', indexcontroller.addTopStocks);
router.get('/index/:id', indexcontroller.getTopStockById);
router.put('/index/:id', indexcontroller.updateTopStock);
router.delete('/index/:id', indexcontroller.deleteTopStock);

// Top Traded
router.get('/toptraded', toptradedcontroller.getTopStocks);
router.post('/toptraded', toptradedcontroller.addTopStocks);
router.get('/toptraded/:id', toptradedcontroller.getTopStockById);
router.put('/toptraded/:id', toptradedcontroller.updateTopStock);
router.delete('/toptraded/:id', toptradedcontroller.deleteTopStock);

// Popular Funds
router.get('/popularfunds', popularFundController.getTopStocks);
router.post('/popularfunds', popularFundController.addTopStocks);
router.get('/popularfunds/:id', popularFundController.getTopStockById);
router.put('/popularfunds/:id', popularFundController.updateTopStock);
router.delete('/popularfunds/:id', popularFundController.deleteTopStock);

// FNO
router.get('/fno', fnocontroller.getTopStocks);
router.post('/fno', fnocontroller.addTopStocks);
router.get('/fno/:id', fnocontroller.getTopStockById);
router.put('/fno/:id', fnocontroller.updateTopStock);
router.patch('/fno/:name', fnocontroller.updateStockByName);
router.delete('/fno/:id', fnocontroller.deleteTopStock);

// FNO Losers
router.get('/fnoloosers', fnolooserscontroller.getTopStocks);
router.post('/fnoloosers', fnolooserscontroller.addTopStocks);
router.get('/fnoloosers/:id', fnolooserscontroller.getTopStockById);
router.patch('/fnoloosers/:name', fnolooserscontroller.updateStockByName);
router.put('/fnoloosers/:id', fnolooserscontroller.updateTopStock);
router.delete('/fnoloosers/:id', fnolooserscontroller.deleteTopStock);

// Groww Fund
router.get('/growfund', growfundcontroller.getTopStocks);
router.post('/growfund', growfundcontroller.addTopStocks);
router.get('/growfund/:id', growfundcontroller.getTopStockById);
router.put('/growfund/:id', growfundcontroller.updateTopStock);
router.delete('/growfund/:id', growfundcontroller.deleteTopStock);

export default router;
