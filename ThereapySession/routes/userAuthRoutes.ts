import { Router } from 'express';
import { sendOtp, verifyOtpAndSignup, loginUser } from '../controllers/userAuthController';

const router = Router();

router.post('/signup/send-otp', sendOtp);
router.post('/signup/verify-otp', verifyOtpAndSignup);
router.post('/login', loginUser);

export default router;
