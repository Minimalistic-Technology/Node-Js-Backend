import express from 'express';
import {
  createUpcomingProduct,
  getAllUpcomingProducts,
  getUpcomingProductById,
  updateUpcomingProduct,
  deleteUpcomingProduct
} from '../controllers/upcomingProductController';

const router = express.Router();

router.post('/upcoming', createUpcomingProduct);
router.get('/upcoming', getAllUpcomingProducts);
router.get('/upcoming/:id', getUpcomingProductById);
router.put('/upcoming/:id', updateUpcomingProduct);
router.delete('/upcoming/:id', deleteUpcomingProduct);

export default router;
