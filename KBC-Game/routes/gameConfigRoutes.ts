import { Router } from 'express';
import { 
  createGameConfig,
  getAllGameConfigs,
  getGameConfigById,
  updateGameConfig,
  deleteGameConfig,
  updatePrizeLadderMedia
} from '../controllers/gameConfigController';
import { requireAdminAuth } from '../middlewares/authMiddleware';
import { uploadSingle, validateUpload } from "../middlewares/uploadStream";

const router = Router();

router.post('/', requireAdminAuth, createGameConfig);
router.get('/', getAllGameConfigs);
router.get('/:id', getGameConfigById);
router.put('/:id', requireAdminAuth, updateGameConfig);
router.post('/update/PL', requireAdminAuth, uploadSingle("file"), updatePrizeLadderMedia);
router.delete('/:id', requireAdminAuth, deleteGameConfig);

export default router;