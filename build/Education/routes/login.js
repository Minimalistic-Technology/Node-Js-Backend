"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logincontroller_1 = require("../controllers/logincontroller");
const router = (0, express_1.Router)();
// Routes
router.post('/signup', logincontroller_1.signup);
router.post('/login', logincontroller_1.login);
router.post('/refresh-token', logincontroller_1.refreshToken);
router.post('/logout', logincontroller_1.logout);
// Protected routes (require authentication)
router.get('/users', logincontroller_1.getAllUsers); // Get all users (without passwords)
router.patch('/users/:id/role', logincontroller_1.authenticateToken, logincontroller_1.updateUserRole); // Update user role
router.get('/user', logincontroller_1.authenticateToken, logincontroller_1.getUserByToken); // Get user by token
exports.default = router;
