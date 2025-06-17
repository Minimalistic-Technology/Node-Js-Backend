import express from 'express';

import {
  addProductTool,
  getAllProductTools,
  getProductToolById,
  updateProductTool,
  deleteProductTool
} from '../../controllers/stocks/productToolController';

router.post('/tools', addProductTool);
router.get('/tools', getAllProductTools);
router.get('/tools/:id', getProductToolById);
router.put('/tools/:id', updateProductTool);
router.delete('/tools/:id', deleteProductTool);

export default router;