import { Router } from 'express';
import { 
  createGameConfig,
  getAllGameConfigs,
  getGameConfigById,
  updateGameConfig,
  deleteGameConfig
} from '../controllers/gameConfigController';
import { requireAdminAuth } from '../middlewares/authMiddleware';

const router = Router();

router.post('/', requireAdminAuth, createGameConfig);
router.get('/', getAllGameConfigs);
router.get('/:id', getGameConfigById);
router.put('/:id', requireAdminAuth, updateGameConfig);
router.delete('/:id', requireAdminAuth, deleteGameConfig);

export default router;