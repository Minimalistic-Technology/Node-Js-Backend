import { Router } from 'express';
import { protect } from '@/middleware/auth.middleware';
import { userController } from './user.controller';

const router = Router();

/**
 * @openapi
 * /api/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string, description: "User's unique ID" }
 *                 email: { type: string, format: email }
 *                 name: { type: string }
 *                 emailVerified: { type: boolean }
 *       "401":
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', protect, userController.getProfile);

export const userRoutes = router;