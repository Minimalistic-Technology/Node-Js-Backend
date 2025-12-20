import express from 'express';
import {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem
} from '../controllers/practiceProblemController';

const router = express.Router();

router.post('/problems', createProblem);
router.get('/problems', getAllProblems);
router.get('/problems/:id', getProblemById);
router.put('/problems/:id', updateProblem);
router.delete('/problems/:id', deleteProblem);

export default router;
