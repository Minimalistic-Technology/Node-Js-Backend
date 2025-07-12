import { RequestHandler } from 'express';
import { ImageModel } from '../models/image';

export const createImage: RequestHandler = async (req, res) => {
  try {
    const { title, base64 } = req.body;
    const image = await ImageModel.create({ title, base64 });
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: 'Image creation failed' });
  }
};

export const getAllImages: RequestHandler = async (_req, res) => {
  const images = await ImageModel.find();
  res.json(images);
};

export const getImageById: RequestHandler = async (req, res) => {
  const image = await ImageModel.findById(req.params.id);
  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }
  res.json(image);
};

export const updateImage: RequestHandler = async (req, res) => {
  const { title, base64 } = req.body;
  const image = await ImageModel.findByIdAndUpdate(
    req.params.id,
    { title, base64 },
    { new: true }
  );
  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }
  res.json(image);
};

export const deleteImage: RequestHandler = async (req, res) => {
  const image = await ImageModel.findByIdAndDelete(req.params.id);
  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }
  res.json({ message: 'Image deleted' });
};
