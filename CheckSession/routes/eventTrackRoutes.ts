import express from "express";
import {
  trackEventClick,
  getAllEventTracks,
  getEventTrackById,
  updateEventTrack,
  deleteEventTrack
} from "../controllers/eventTrackController";

const router = express.Router();

router.post('/event', trackEventClick);
router.get('/event', getAllEventTracks);
router.get('/event/:id', getEventTrackById);
router.put('/event/:id', updateEventTrack);
router.delete('/event/:id', deleteEventTrack);

export default router;
