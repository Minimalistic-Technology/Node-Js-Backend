import express from 'express';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} from '../controllers/contactController';

const router = express.Router();

router.post('/register-contact', createContact);
router.get('/register-contacts', getContacts);
router.get('/register-contacts/:id', getContactById);
router.put('/register-contacts/:id', updateContact);
router.delete('/register-contacts/:id', deleteContact);

export default router;
