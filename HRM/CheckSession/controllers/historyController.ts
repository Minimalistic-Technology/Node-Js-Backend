import { Request, Response } from 'express';
import { HistoryModel } from '../models/history';
import mongoose, { ObjectId } from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}


//-------------------Adimn -> See User History


export const getAllUserHistoryByUserId = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'Admin';

    if (!isAdmin) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    const histories = await HistoryModel.find({ userId: new mongoose.Types.ObjectId(req.params.userId) }).sort({ createdAt: -1 });
    if (!histories) {
      res.status(404).json({ message: 'History not found' });
      return;
    }
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get histories' });
  }
};

//------------------- User -> See Self History


export const getHistoryByUserId = async (req: Request, res: Response): Promise<void> => {
  try {
    const histories = await HistoryModel.find({ userId: new mongoose.Types.ObjectId(req.params.userId) }).sort({ createdAt: -1 });
    if (!histories) {
      res.status(404).json({ message: 'History not found' });
      return;
    }
    res.json(histories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get histories' });
  }
};

//-------------------CheckIn

interface ICheckInRequestBody {
  userId: ObjectId;
  history: {
    checkIn: {
      city: string;
      state: string;
      country: string;
      ip: string;
    };
    checkOut: null
  };
}

export const checkIn = async (
  req: Request<{}, {}, ICheckInRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user;
    const { history } = req.body;
    const { checkIn, checkOut } = history;
    const { city, state, country, ip } = checkIn;

    const checkInData = {
      dateTime: new Date(),
      city,
      state,
      country,
      ip
    };

    const newHistoryEntry = {
      checkIn: checkInData,
      checkOut
    };

    const existingHistory = await HistoryModel.findOne({ userId });

    const checkPreviousCheckOut = () => {
      if (existingHistory && existingHistory.history.length > 0) {
        const lastIndex = existingHistory.history.length - 1;
        const previousHistory = existingHistory.history[lastIndex];

        if (previousHistory.checkOut === null && previousHistory.checkIn.dateTime.getDate() < new Date().getDate()) {
          const setCheckoutDate = structuredClone(previousHistory.checkIn.dateTime);
          setCheckoutDate.setHours(23, 59, 0, 0);
          console.log('Setting checkout date to end of day:', setCheckoutDate);
          console.log('Previous check-in date:', previousHistory.checkIn.dateTime);
          previousHistory.checkOut = {
            dateTime: setCheckoutDate,
            city: checkInData.city,
            state: checkInData.state,
            country: checkInData.country,
            ip: checkInData.ip
          };
        }
        else if (previousHistory.checkOut === null && previousHistory.checkIn.dateTime.getDate() === new Date().getDate()) {
          res.status(403).json({ error: 'Kindly CheckOut first.' });
          return false;
        }
      }
      return true;
    }

    if (existingHistory) {
      const canCheckIn = checkPreviousCheckOut();
      if (!canCheckIn) return;

      existingHistory.history.push(newHistoryEntry);
      await existingHistory.save();
    } else {
      const checkInDetails = new HistoryModel({
        userId,
        history: [newHistoryEntry]
      });
      await checkInDetails.save();
    }

    res.status(201).json({ message: 'Check-in successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Check-in failed' });
  }
};

//-------------------CheckOut


interface ICheckOutRequestBody {
  checkOut: {
    city: string;
    state: string;
    country: string;
    ip: string;
  }
}

export const checkOut = async (req: Request<{ userId: string }, {}, ICheckOutRequestBody>, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    const { checkOut } = req.body;
    const existingHistory = await HistoryModel.findOne({ userId });
    const lastIndex = existingHistory!.history.length - 1;
    const HistoryRecord = existingHistory!.history[lastIndex];
    HistoryRecord.checkOut = {
      dateTime: new Date(),
      city: checkOut.city,
      state: checkOut.state,
      country: checkOut.country,
      ip: checkOut.ip
    };

    await existingHistory!.save();
    res.status(200).json({ message: 'Check-out successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Check-out failed' });
  }
};