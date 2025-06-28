import express from "express";
import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting
} from "../controllers/meetingController";

const router = express.Router();

router.post("/meetings", createMeeting);
router.get("/meetings", getAllMeetings);
router.get("/meetings/:id", getMeetingById);
router.put("/meetings/:id", updateMeeting);
router.delete("/meetings/:id", deleteMeeting);

export default router;
