import express from 'express';
import { bulkCreateUser } from '../controllers/usercontroller';

const router = express.Router();

router.post('/users/bulk', bulkCreateUser); // Bulk import route

export default router;