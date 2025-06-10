const express = require('express');
const { sendOtp } = require('../controllers/otpController');
const router = express.Router();

router.post('/send-otp', sendOtp);

module.exports = router;
