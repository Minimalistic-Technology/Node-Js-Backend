import express from 'express';
import {
  addSection,
  getAllSections,
  getSectionById,
  updateSectionById,
  deleteSectionById,
  addSubtopic,
  updateSubtopic,
  deleteSubtopic,
  addQuizToSection,
  removeQuizFromSection
} from '../controllers/documentationController';

const router = express.Router();

router.post('/docs', addSection);
router.get('/docs', getAllSections);
router.get('/docs/:id', getSectionById);
router.put('/docs/:id', updateSectionById);
router.delete('/docs/:id', deleteSectionById);

router.post('/docs/:id/subtopics', addSubtopic);
router.put('/docs/:id/subtopics/:subId', updateSubtopic);
router.delete('/docs/:id/subtopics/:subId', deleteSubtopic);

router.post('/docs/:id/quiz', addQuizToSection);
router.delete('/docs/:id/quiz/:quizIndex', removeQuizFromSection);

export default router;
