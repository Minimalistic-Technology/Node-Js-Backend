const express = require('express');

const topfuturecontroller = require('../controllers/topfuturecontroller');

router.get('/top-stocks', topfuturecontroller.getTopStocks);
router.post('/top-stocks', topfuturecontroller.addTopStocks);
router.get('/top-stocks/:id', topfuturecontroller.getTopStockById);
router.put('/top-stocks/:id',   topfuturecontroller.updateTopStock);
router.delete('/top-stocks/:id', topfuturecontroller.deleteTopStock);

module.exports = router;