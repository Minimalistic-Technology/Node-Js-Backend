import { Request, Response } from "express";
import FitnessProfile from "../models/FitnessProfile";
import Workout from "../models/Workout";
import { AuthRequest } from "../middleware/authMiddleware";

export const getFitnessProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const profile = await FitnessProfile.findById(req.userId).populate("favourites");

    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    const totalWorkouts = await Workout.countDocuments();
    const favouriteWorkoutsCount = profile.favourites.length;

    res.json({
      profile,
      stats: {
        totalWorkouts,
        favouriteWorkoutsCount,
      },
      favouriteWorkouts: profile.favourites,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching fitness profile", error });
  }
};

export const updateFitnessProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updatedProfile = await FitnessProfile.findByIdAndUpdate(req.userId, req.body, {
      new: true,
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: "Error updating fitness profile", error });
  }
};

export const deleteFitnessProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await FitnessProfile.findByIdAndDelete(req.userId);
    res.json({ message: "Fitness profile deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fitness profile", error });
  }
};

export const addFavouriteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const profile = await FitnessProfile.findById(req.userId);
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    if (!profile.favourites.includes(workoutId as any)) {
      profile.favourites.push(workoutId as any);
      await profile.save();
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error adding favourite", error });
  }
};

export const removeFavouriteWorkout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { workoutId } = req.params;
    const profile = await FitnessProfile.findById(req.userId);
    if (!profile) {
      res.status(404).json({ message: "Profile not found" });
      return;
    }

    profile.favourites = profile.favourites.filter(
      (favId) => favId.toString() !== workoutId
    );
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Error removing favourite", error });
  }
};
