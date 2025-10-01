import { Router } from 'express';
import { signupUser, loginUser } from '../controllers/userAuthController';

const router = Router();

router.post('/signup', signupUser);
router.post('/login', loginUser);

export default router;
