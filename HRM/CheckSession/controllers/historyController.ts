import { Request, Response } from "express";
import { HistoryModel } from "../models/history";
import mongoose, { ObjectId } from "mongoose";

interface AuthRequest extends Request {
  user?: any;
}

// ------------------- Admin -> See User History ------------------- 
export const getAllUserHistoryByUserId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const isAdmin = req.user?.role === "Admin";

    if (!isAdmin) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const histories = await HistoryModel.find({
      userId: new mongoose.Types.ObjectId(req.params.userId),
    }).sort({ createdAt: -1 });

    if (!histories || histories.length === 0) {
      res.status(404).json({ message: "History not found" });
      return;
    }

    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: "Failed to get histories" });
  }
};

// ------------------- User -> See Self History -------------------
export const getHistoryByUserId = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const histories = await HistoryModel.find({
      userId: req.user?.id,
    }).sort({ createdAt: -1 });

    if (!histories || histories.length === 0) {
      res.status(404).json({ message: "History not found" });
      return;
    }

    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: "Failed to get histories" });
  }
};

// ------------------- Check-In -------------------
interface ICheckInRequestBody {
  userId: ObjectId;                 // !!!  can't get user id from req.body , as we have to take ot from middleware  !!!
  history: {
    checkIn: {
      city?: string;
      state?: string;
      country?: string;
      ip?: string;
      lat?: number;
      long?: number;
    };
    checkOut: null;
  };
}

export const checkIn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    // const { history }: ICheckInRequestBody = req.body;
    // const { checkIn, checkOut } = history;
    const { checkIn , checkOut } = req.body;
    
    const { city, state, country, ip, lat, long } = checkIn;

    const checkInData = {
      dateTime: new Date(),
      city,
      state,
      country,
      ip,
      lat,
      long,
    };

    const newHistoryEntry = {
      checkIn: checkInData,
      checkOut,
    };

    const existingHistory = await HistoryModel.findOne({ userId });

    const checkPreviousCheckOut = () => {
      if (existingHistory && existingHistory.history.length > 0) {
        const lastIndex = existingHistory.history.length - 1;
        const previousHistory = existingHistory.history[lastIndex];

        if (
          previousHistory.checkOut === null &&
          previousHistory.checkIn.dateTime.getDate() < new Date().getDate()
        ) {
          const setCheckoutDate = structuredClone(
            previousHistory.checkIn.dateTime
          );
          setCheckoutDate.setHours(23, 59, 0, 0);

          previousHistory.checkOut = {
            dateTime: setCheckoutDate,
            city: checkInData.city,
            state: checkInData.state,
            country: checkInData.country,
            ip: checkInData.ip,
            lat: checkInData.lat,
            long: checkInData.long,
          };
        } else if (
          previousHistory.checkOut === null &&
          previousHistory.checkIn.dateTime.getDate() === new Date().getDate()
        ) {
          res.status(403).json({ error: "Kindly CheckOut first." });
          return false;
        }
      }
      return true;
    };

    if (existingHistory) {
      const canCheckIn = checkPreviousCheckOut();
      if (!canCheckIn) return;

      existingHistory.history.push(newHistoryEntry);
      await existingHistory.save();
    } else {
      const checkInDetails = new HistoryModel({
        userId,
        history: [newHistoryEntry],
      });
      await checkInDetails.save();
    }

    res.status(201).json({ message: "Check-in successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Check-in failed" });
  }
};

// ------------------- Check-Out -------------------
interface ICheckOutRequestBody {
  checkOut: {
    city?: string;
    state?: string;
    country?: string;
    ip?: string;
    lat?: number;
    long?: number;
  };
}

export const checkOut = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { checkOut }: ICheckOutRequestBody = req.body;
    const { city, state, country, ip, lat, long } = checkOut || {};

    const existingHistory = await HistoryModel.findOne({ userId });
    if (!existingHistory || existingHistory.history.length === 0) {
      res.status(404).json({ error: "No check-in found for checkout" });
      return;
    }

    const lastIndex = existingHistory.history.length - 1;
    const HistoryRecord = existingHistory.history[lastIndex];

    if (HistoryRecord.checkOut) {
      res.status(400).json({ error: "Already checked out" });
      return;
    }

    HistoryRecord.checkOut = {
      dateTime: new Date(),
      city,
      state,
      country,
      ip,
      lat,
      long,
    };

    await existingHistory.save();
    res.status(200).json({ message: "Check-out successful" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: "Check-out failed: " + err.message });
  }
};
