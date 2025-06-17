import express, { Router } from 'express';
import * as courseController from '../../controllers/courseController';
import {authenticateToken} from '../../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

router.post('/', authenticateToken, courseController.createCourse);
router.put('/:id', authenticateToken, courseController.updateCourse);
router.delete('/:id', authenticateToken, courseController.deleteCourse);

export default router;
