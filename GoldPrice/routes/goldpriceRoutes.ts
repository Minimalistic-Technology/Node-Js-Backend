import express, { Router } from 'express';
import * as goldController from '../controllers/goldpriceController';

const router: Router = express.Router();

router.get('/today', goldController.getTodayPrice);
router.post('/', goldController.addPrice);
router.put('/:date', goldController.updatePrice);

export default router;
