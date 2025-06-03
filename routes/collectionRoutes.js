const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');

router.get('/get', collectionController.getCollections);
router.post('/add', collectionController.postCollection);
router.put('/update/:id', collectionController.putCollection);
router.delete('/delete/:id', collectionController.deleteCollection);

module.exports = router;
