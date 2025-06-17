
import express from 'express';
const { Router } = require('express');

import {
  addStocksInNews,
  getAllStocksInNews,
  getStockInNewsById,
  updateStocksInNews,
  deleteStocksInNews,
} from '../../controllers/stocks/stocksInNewsController';


router.post('/stocks-in-news', addStocksInNews);
router.get('/stocks-in-news', getAllStocksInNews);
router.get('/stocks-in-news/:id', getStockInNewsById);
router.put('/stocks-in-news/:id', updateStocksInNews);
router.delete('/stocks-in-news/:id', deleteStocksInNews);

export default router;