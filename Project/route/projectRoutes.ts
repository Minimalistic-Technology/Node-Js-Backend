import express from 'express';
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} from '../../controllers/projectController';

const router = express.Router();

router.post('/projects', createProject);
router.get('/projects', getProjects);
router.put('/projects/:id', updateProject);
router.delete('/projects/:id', deleteProject);

export default router;
