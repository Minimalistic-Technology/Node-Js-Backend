import express from 'express';
import * as topMarketController from '../../controllers/stocks/topmarketController';

router.post('/topmarket', topMarketController.createStock);
router.get('/topmarket', topMarketController.getAllStocks);
router.get('/topmarket/:id', topMarketController.getStockDetails);
router.patch('/topmarket/:name', topMarketController.updateStockByName);
router.put('/topmarket/:id', topMarketController.updateStock);
router.delete('/topmarket/:id', topMarketController.deleteStock);

export default router;