import { Router } from 'express';
import { 
  createGameConfig,
  getAllGameConfigs,
  getGameConfigById,
  updateGameConfig,
  deleteGameConfig
} from '../controllers/gameConfig.controller';
import { requireAdminAuth } from '../middlewares/authMiddleware';

const router = Router();

// All routes are protected by admin auth
router.post('/', requireAdminAuth, createGameConfig);
router.get('/', requireAdminAuth, getAllGameConfigs);
router.get('/:id', requireAdminAuth, getGameConfigById);
router.put('/:id', requireAdminAuth, updateGameConfig);
router.delete('/:id', requireAdminAuth, deleteGameConfig);

export default router;