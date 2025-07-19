import { Request, Response } from 'express';
import { LocationModel } from '../models/location';

// CREATE
export const createLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = new LocationModel(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create location' });
  }
};

// READ ALL
export const getAllLocations = async (_req: Request, res: Response): Promise<void> => {
  try {
    const locations = await LocationModel.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get locations' });
  }
};

// READ ONE
export const getLocationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = await LocationModel.findById(req.params.id);
    if (!location)  res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch location' });
  }
};

// UPDATE
export const updateLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    const location = await LocationModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!location)  res.status(404).json({ message: 'Location not found' });
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location' });
  }
};

// DELETE
export const deleteLocation = async (req: Request, res: Response): Promise<void> => {
  try {
    await LocationModel.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete location' });
  }
};
