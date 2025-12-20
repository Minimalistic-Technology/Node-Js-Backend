import { Router } from "express";
import { auth } from "../middleware/authMiddleware";
import {
  getFitnessProfile,
  updateFitnessProfile,
  deleteFitnessProfile,
  addFavouriteWorkout,
  removeFavouriteWorkout,
} from "../controllers/fitnessProfileController";

const router = Router();

router.get("/me", auth, getFitnessProfile);
router.put("/me", auth, updateFitnessProfile);
router.delete("/me", auth, deleteFitnessProfile);

router.post("/favourites/:workoutId", auth, addFavouriteWorkout);
router.delete("/favourites/:workoutId", auth, removeFavouriteWorkout);

export default router;
