import express from 'express';
import {
  createLanguage,
  getAllLanguages,
  getLanguageById,
  updateLanguage,
  deleteLanguage
} from '../controllers/languageController';

const router = express.Router();

router.post('/language', createLanguage);
router.get('/language', getAllLanguages);
router.get('/language/:id', getLanguageById);
router.put('/language/:id', updateLanguage);
router.delete('/language/:id', deleteLanguage);

export default router;
