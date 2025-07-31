import express from 'express';
import {
  addSection,
  getAllSections,
  getSectionById,
  updateSectionById,
  deleteSectionById
} from '../controllers/documentationController';

const router = express.Router();

router.post('/docs', addSection);
router.get('/docs', getAllSections);
router.get('/docs/:id', getSectionById);
router.put('/docs/:id', updateSectionById);
router.delete('/docs/:id', deleteSectionById);

export default router;
