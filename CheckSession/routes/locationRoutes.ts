import express from 'express';
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} from '../controllers/locationController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/location', verifyToken, createLocation);
router.get('/location', verifyToken, getAllLocations);
router.get('/location/:id', verifyToken, getLocationById);
router.put('/location/:id', verifyToken, updateLocation);
router.delete('/location/:id', verifyToken, deleteLocation);

export default router;
