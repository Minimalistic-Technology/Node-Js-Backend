import express from 'express';
import {
  createStat,
  getAllStats,
  updateStat,
  deleteStat
} from '../controllers/dashboardStatController';

const router = express.Router();

router.post('/stats', createStat);
router.get('/stats', getAllStats);
router.put('/stats/:id', updateStat);
router.delete('/stats/:id', deleteStat);

export default router;
