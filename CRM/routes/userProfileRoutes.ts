import express from "express";
import {
  createUserProfile,
  getAllProfiles,
  getProfileById,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userProfileController";

const router = express.Router();

router.post('/user-profiles', createUserProfile);
router.get('/user-profiles', getAllProfiles);
router.get('/user-profiles/:id', getProfileById);
router.put('/user-profiles/:id', updateUserProfile);
router.delete('/user-profiles/:id', deleteUserProfile);

export default router;
