import express, { Router } from 'express';
import * as quoteController from '../controllers/quoteBlogController';

const router: Router = express.Router();

router.get('/latest', quoteController.getLatestQuotes);
router.post('/', quoteController.createQuote);

export default router;
