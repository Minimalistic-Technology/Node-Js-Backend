const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
// Fetch user details by ID (Protected route)
router.get('/user/:id', authenticateToken, authController.getUserById); 

module.exports = router;
