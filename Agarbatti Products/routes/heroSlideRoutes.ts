import express from 'express';
import {
  createHeroSlide,
  getAllHeroSlides,
  getHeroSlideById,
  updateHeroSlide,
  deleteHeroSlide,
} from '../Controllers/heroSlideController';

const router = express.Router();

router.post('/heroslides', createHeroSlide);
router.get('/heroslides', getAllHeroSlides);
router.get('/heroslides/:id', getHeroSlideById);
router.put('/heroslides/:id', updateHeroSlide);
router.delete('/heroslides/:id', deleteHeroSlide);

export default router;
