const express = require('express');
const router = express.Router();
const quoteController = require('../controllers/quoteBlogController');

router.get('/latest', quoteController.getLatestQuotes);
router.post('/', quoteController.createQuote);

module.exports = router;
