import express, { Router } from 'express';
import * as goldController from '../controllers/goldpriceController';

const router: Router = express.Router();

router.get('/goldprice/today', goldController.getTodayPrice);
router.post('/goldprice', goldController.addPrice);
router.put('/goldprice/:date', goldController.updatePrice);

export default router;
