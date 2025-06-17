import express from 'express';
import {
  createBMI,
  getBMIHistory,
  updateBMI,
  deleteBMI,
  batchBMI,
} from '../controllers/bmi.controller';

const router = express.Router();

router.post('/bmi', createBMI);
router.post('/bmi/batch', batchBMI); // for multiple entries
router.get('/bmi/:userId', getBMIHistory);
router.put('/bmi/:id', updateBMI);
router.delete('/bmi/:id', deleteBMI);

export default router;
