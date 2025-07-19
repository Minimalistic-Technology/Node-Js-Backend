import express from "express";
import {
  createMeeting,
  getAllMeetings,
  getMeetingById,
  updateMeeting,
  deleteMeeting,
} from "../controllers/meetingController";

const router = express.Router();

router.post("/", createMeeting);
router.get("/", getAllMeetings);
router.get("/:id", getMeetingById);
router.put("/:id", updateMeeting);
router.delete("/:id", deleteMeeting);

export default router;
