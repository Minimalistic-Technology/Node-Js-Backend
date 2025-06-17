import express, { Request, Response, Router } from 'express';
import * as topTradedController from '../../controllers/toptradedcontroller';

const router: Router = express.Router();

router.get('/toptraded', topTradedController.getTopStocks);
router.post('/toptraded', topTradedController.addTopStocks);
router.get('/toptraded/:id', topTradedController.getTopStockById);
router.put('/toptraded/:id', topTradedController.updateTopStock);
router.delete('/toptraded/:id', topTradedController.deleteTopStock);

export default router;
