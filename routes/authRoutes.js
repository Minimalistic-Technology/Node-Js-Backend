const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
// Check jwt token middleware
const authenticateToken = require('../middleware/authMiddleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

// Public Route (accessible without login)
router.get('/public', (req, res) => {
    res.json({ message: 'This is public data, accessible without login' });
});

// Private Route (requires login to access)
router.get('/private', authenticateToken, authController.userProfile); 


module.exports = router;
