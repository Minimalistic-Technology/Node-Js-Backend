import { Request, Response } from "express";
import FitnessProfile from "../models/FitnessProfile";
import Workout from "../models/Workout";

export const createFitnessProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const newProfile = await FitnessProfile.create(req.body);
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: "Error creating fitness profile", error });
  }
};

export const getFitnessProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const profile = await FitnessProfile.findById(userId).populate("favourites");

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

export const updateFitnessProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const updatedProfile = await FitnessProfile.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: "Error updating fitness profile", error });
  }
};

export const deleteFitnessProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    await FitnessProfile.findByIdAndDelete(userId);
    res.json({ message: "Fitness profile deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting fitness profile", error });
  }
};

export const addFavouriteWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, workoutId } = req.params;
    const profile = await FitnessProfile.findById(userId);
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

export const removeFavouriteWorkout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, workoutId } = req.params;
    const profile = await FitnessProfile.findById(userId);
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
