import express from "express";
import {
  createUserProfile,
  getAllProfiles,
  getProfileById,
  updateUserProfile,
  deleteUserProfile,
} from "../controllers/userProfileController";

const router = express.Router();

router.post('/', createUserProfile);
router.get('/', getAllProfiles);
router.get('/:id', getProfileById);
router.put('/:id', updateUserProfile);
router.delete('/:id', deleteUserProfile);

export default router;
