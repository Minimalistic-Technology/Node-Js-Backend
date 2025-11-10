"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("@/middleware/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/me:
 * get:
 * summary: Get current user profile
 * tags: [User]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: User profile
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * id: { type: string, format: uuid }
 * email: { type: string, format: email }
 * name: { type: string }
 * emailVerified: { type: boolean }
 * 401:
 * description: Unauthorized
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/Error'
 */
router.get('/me', auth_middleware_1.protect, (req, res) => {
    // req.user is attached by the 'protect' middleware
    // With the import added, TypeScript now knows what 'user' is
    const user = req.user; // You can also be explicit
    res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
    });
});
exports.userRoutes = router;
