"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controllers/loginController");
const router = (0, express_1.Router)();
// Routes
router.post('/signup', loginController_1.signup);
router.post('/login', loginController_1.login);
router.post('/refresh-token', loginController_1.refreshToken);
router.post('/logout', loginController_1.logout);
// Protected routes (require authentication)
router.get('/users', loginController_1.getAllUsers); // Get all users (without passwords)
router.patch('/users/:id/role', loginController_1.authenticateToken, loginController_1.updateUserRole); // Update user role
router.get('/user', loginController_1.authenticateToken, loginController_1.getUserByToken); // Get user by token
exports.default = router;
