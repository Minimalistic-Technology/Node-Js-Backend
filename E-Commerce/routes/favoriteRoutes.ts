import express from 'express';
import {
  createFavorite,
  getFavorites,
  updateFavorite,
  deleteFavorite
} from '../controllers/favoriteController';

const router = express.Router();

router.post('/favorites', createFavorite);
router.get('/favorites', getFavorites);
router.put('/favorites/:id', updateFavorite);
router.delete('/favorites/:id', deleteFavorite);

export default router;
