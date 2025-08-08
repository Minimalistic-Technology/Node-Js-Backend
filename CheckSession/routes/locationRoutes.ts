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
router.get('/location', getAllLocations);
router.get('/location/:id', getLocationById);
router.put('/location/:id', updateLocation);
router.delete('/location/:id', deleteLocation);

export default router;
