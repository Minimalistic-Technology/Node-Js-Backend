import express, { Router } from 'express';
import * as collectionController from '../controllers/collectionController';

const router: Router = express.Router();

router.get('/get', collectionController.getCollections);
router.post('/add', collectionController.postCollection);
router.put('/update/:id', collectionController.putCollection);
router.delete('/delete/:id', collectionController.deleteCollection);

export default router;
