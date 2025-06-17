import express from 'express';

import {
  createStock,
  getTopLosers,
  getStocksByCategory,
  getStockDetails,
  updateStock,
  deleteStock,
} from '../../controllers/stocks/toploosersController';

router.post('/toplosers', createStock);
router.get('/toplosers', getTopLosers);
router.get('/toplosers/:category', getStocksByCategory);
router.get('/toplosers/:category/:id', getStockDetails);
router.put('/toplosers/:id', updateStock);
router.delete('/toplosers/:id', deleteStock);

export default router;