import { Request, Response } from 'express';
import Collection, { ICollection } from '../../models/Collection';

// GET /collections
export const getCollections = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await Collection.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

// POST /collections
export const postCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const input = req.body;

    if (Array.isArray(input)) {
      const existingCollections = await Collection.find({ name: { $in: input.map((item: ICollection) => item.name) } });

      if (existingCollections.length > 0) {
        res.status(400).json({
          error: 'Some collections already exist',
          existing: existingCollections.map((item) => item.name),
        });
      }

      const collections = await Collection.insertMany(input);
      res.status(201).json(collections);
    } else {
      const exists = await Collection.findOne({ name: input.name });

      if (exists) {
       res.status(400).json({ error: 'Collection already exists' });
      }

      const collection = new Collection(input);
      await collection.save();
      res.status(201).json(collection);
    }
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to add collection(s)', details: err.message });
  }
};

// PUT /collections/:id
export const putCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update collection' });
  }
};

// DELETE /collections/:id
export const deleteCollection = async (req: Request, res: Response): Promise<void> => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete collection' });
  }
};
