"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const validate_middleware_1 = require("@/middleware/validate.middleware");
const v = __importStar(require("./auth.validation"));
const rateLimit_middleware_1 = require("@/middleware/rateLimit.middleware");
const router = (0, express_1.Router)();
// Apply rate limiting to all auth routes
router.use(rateLimit_middleware_1.authRateLimiter);
router.post('/signup', (0, validate_middleware_1.validate)(v.signupSchema), auth_controller_1.authController.signup);
router.post('/verify-email', (0, validate_middleware_1.validate)(v.verifyEmailSchema), auth_controller_1.authController.verifyEmail);
router.post('/login', (0, validate_middleware_1.validate)(v.loginSchema), auth_controller_1.authController.login);
router.post('/oauth/callback', (0, validate_middleware_1.validate)(v.oauthCallbackSchema), auth_controller_1.authController.oauthCallback);
router.post('/token/refresh', (0, validate_middleware_1.validate)(v.refreshTokenSchema), auth_controller_1.authController.refresh);
router.post('/logout', (0, validate_middleware_1.validate)(v.logoutSchema), auth_controller_1.authController.logout);
exports.authRoutes = router;
