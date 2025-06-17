import express from 'express';

import * as topGainersController from '../../controllers/stocks/topGainersController';


router.post('/topgainers', topGainersController.createStock);
router.get('/topgainers', topGainersController.getTopGainers);
router.get('/topgainers/:category', topGainersController.getStocksByCategory);
router.get('/topgainers/:category/:id', topGainersController.getStockDetails);
router.put('/topgainers/:id', topGainersController.updateStock);
router.delete('/topgainers/:id', topGainersController.deleteStock);

export default router;