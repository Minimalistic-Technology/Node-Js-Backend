import express from 'express';
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from '../controllers/templateController';

const router = express.Router();

router.post('/template', createTemplate);
router.get('/template', getTemplates);
router.get('/template/:id', getTemplateById);
router.put('/template/:id', updateTemplate);
router.delete('/template/:id', deleteTemplate);

export default router;
