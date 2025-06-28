import { Router } from 'express';
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
} from '../controllers/documentController';

const router = Router();
router.get('/documents', getAllDocuments);
router.get('/document/:id', getDocumentById);
router.post('/document', createDocument);
router.put('/document/:id', updateDocument);
router.delete('/document/:id', deleteDocument);

export default router;