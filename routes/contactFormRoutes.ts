import express from 'express';
import {
  submitContactForm,
  getContacts,
  updateContact,
  deleteContact
} from '../controllers/contactController';

const router = express.Router();

router.post('/contact', submitContactForm);
router.get('/contact', getContacts);
router.put('/contact/:id', updateContact);
router.delete('/contact/:id', deleteContact);

export default router;
