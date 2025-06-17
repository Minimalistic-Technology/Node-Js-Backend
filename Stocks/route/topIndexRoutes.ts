import express, { Router } from 'express';
import {
  getTopStocks,
  addTopStocks,
  getTopStockById,
  updateTopStock,
  deleteTopStock,
} from '../../controllers/topindexfuturecontroller';

const router: Router = express.Router();

router.get('/topindex', getTopStocks);
router.post('/topindex', addTopStocks);
router.get('/topindex/:id', getTopStockById);
router.put('/topindex/:id', updateTopStock);
router.delete('/topindex/:id', deleteTopStock);

export default router;
