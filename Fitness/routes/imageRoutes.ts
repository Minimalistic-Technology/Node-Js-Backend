import { Request, Response } from 'express';
import { Router } from 'express';
import {
  createImage,
  getAllImages,
  getImageById,
  updateImage,
  deleteImage
} from '../controllers/imageController';

const router = Router();

router.post('/images', createImage);
router.get('/images', getAllImages);
router.get('/images/:id', getImageById);
router.put('/images/:id', updateImage);
router.delete('/images/:id', deleteImage);

export default router;
