// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../../controllers/figma/email');

// POST route to submit contact form
router.post('/submit', contactController.submitContactForm);

// GET route to retrieve contact details
router.get('/details', contactController.getContactDetails);

module.exports = router;