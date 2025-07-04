import express from 'express';
import {
  createContact,
  getContacts,
  updateContact,
  deleteContact
} from '../controllers/contactController';

const router = express.Router();

router.post('/register-contacts', createContact);
router.get('/register-contacts', getContacts);
router.put('/register-contacts/:id', updateContact);
router.delete('/register-contacts/:id', deleteContact);

export default router;
