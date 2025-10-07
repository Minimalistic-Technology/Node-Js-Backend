import { Router } from 'express';
import { BannerController } from '../../BookStore/controllers/bannerController';

const router = Router();

// Routes
router.get('/', BannerController.getAllBanners);
router.get('/active', BannerController.getActiveBanners);
router.get('/inactive', BannerController.getInactiveBanners);
router.get('/:id', BannerController.getBannerById);
router.post('/', BannerController.createBanner);
router.put('/:id', BannerController.updateBanner);
router.delete('/:id', BannerController.deleteBanner);

export default router;