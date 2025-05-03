const express = require('express');
const router = express.Router();
const goldController = require('../controllers/goldPriceController');

router.get('/today', goldController.getTodayPrice);
router.post('/', goldController.addPrice);
router.put('/:date', goldController.updatePrice);

module.exports = router;