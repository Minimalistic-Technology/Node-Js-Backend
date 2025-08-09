import { Request, Response } from 'express';
import { LocationModel } from '../models/location';

interface AuthRequest extends Request {
  user?: any;
}

export const createLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user.id;
    const location = new LocationModel({ ...req.body, userId });
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    console.error('CREATE LOCATION ERROR:', err);
    res.status(500).json({ error: 'Failed to create location' });
  }
};

export const getAllLocations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const isAdmin = req.user?.role === 'Admin';
    const userId = req.user?.id;

    let query = {};
    if (!isAdmin) {
      query = { userId }; // Regular users see only their own
    }

    const locations = await LocationModel.find(query).sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get locations' });
  }
};

export const getLocationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const location = await LocationModel.findById(req.params.id);
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

export const updateLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const location = await LocationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location) {
      res.status(404).json({ message: 'Location not found' });
      return;
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location' });
  }
};

export const deleteLocation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await LocationModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
