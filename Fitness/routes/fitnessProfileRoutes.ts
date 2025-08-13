import { Router } from "express";
import {
  createFitnessProfile,
  getFitnessProfile,
  updateFitnessProfile,
  deleteFitnessProfile,
  addFavouriteWorkout,
  removeFavouriteWorkout,
} from "../controllers/fitnessProfileController";

const router = Router();

router.post("/create", createFitnessProfile);
router.get("/:userId", getFitnessProfile);
router.put("/:userId", updateFitnessProfile);
router.delete("/:userId", deleteFitnessProfile);

router.post("/:userId/favourites/:workoutId", addFavouriteWorkout);
router.delete("/:userId/favourites/:workoutId", removeFavouriteWorkout);

export default router;
