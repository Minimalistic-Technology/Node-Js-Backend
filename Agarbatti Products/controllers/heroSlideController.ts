import { Request, Response } from 'express';
import { HeroSlideModel } from '../Models/HeroSlide';

export const createHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, image } = req.body;
    const newSlide = new HeroSlideModel({ title, subtitle, image });
    const savedSlide = await newSlide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create HeroSlide', error });
  }
};

export const getAllHeroSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await HeroSlideModel.find();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getHeroSlideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const slide = await HeroSlideModel.findById(req.params.id);
    if (!slide)  res.status(404).json({ message: 'HeroSlide not found' });
    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const updateHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subtitle, image } = req.body;
    const updatedSlide = await HeroSlideModel.findByIdAndUpdate(
      req.params.id,
      { title, subtitle, image },
      { new: true, runValidators: true }
    );
    if (!updatedSlide) res.status(404).json({ message: 'HeroSlide not found' });
    res.json(updatedSlide);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update HeroSlide', error });
  }
};

export const deleteHeroSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedSlide = await HeroSlideModel.findByIdAndDelete(req.params.id);
    if (!deletedSlide) res.status(404).json({ message: 'HeroSlide not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete HeroSlide', error });
  }
};
