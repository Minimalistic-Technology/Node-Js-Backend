import express from 'express';
import {
  createWorkout,
  getWorkouts,
  updateWorkout,
  deleteWorkout
} from '../controllers/workoutController';

const router = express.Router();

router.post('/workouts', createWorkout);
router.get('/workouts', getWorkouts);
router.put('/workouts/:id', updateWorkout);
router.delete('/workouts/:id', deleteWorkout);

export default router;
