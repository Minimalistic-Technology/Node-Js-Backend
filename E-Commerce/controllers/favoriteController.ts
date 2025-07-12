import { Request, Response } from 'express';
import { FavoriteModel } from '../models/favorite';

export const createFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const favorite = new FavoriteModel(req.body);
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add favorite' });
  }
};

export const getFavorites = async (_req: Request, res: Response): Promise<void> => {
  try {
    const favorites = await FavoriteModel.find();
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const updateFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await FavoriteModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update favorite' });
  }
};

export const deleteFavorite = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await FavoriteModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }
    res.json({ message: 'Favorite removed' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete favorite' });
  }
};
