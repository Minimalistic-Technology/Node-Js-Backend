import express from 'express';
import { signup, login } from '../controllers/authAccessController';

const router = express.Router();

// Updated unique endpoints
router.post('/access-control/signup', signup);
router.post('/access-control/login', login);

export default router;
