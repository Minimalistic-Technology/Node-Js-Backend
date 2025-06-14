import express, { Router } from 'express';
import { submitContactForm, getContactDetails } from '../../controllers/figma/email';

const router: Router = express.Router();

// POST /submit - Submit contact form
router.post('/submit', submitContactForm);

// GET /details - Get all contact submissions
router.get('/details', getContactDetails);

export default router;
