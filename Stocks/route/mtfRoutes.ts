import express from 'express';

import {
  addMTFStocks,
  getAllMTFStocks,
  getMTFStockById,
  updateMTFStock,
  deleteMTFStock
} from '../../controllers/stocks/mtfController';

router.post('/mtf', addMTFStocks);
router.get('/mtf', getAllMTFStocks);
router.get('/mtf/:id', getMTFStockById);
router.put('/mtf/:id', updateMTFStock);
router.delete('/mtf/:id', deleteMTFStock);

export default router;