const Collection = require('../models/Collection');

exports.getCollections = async (req, res) => {
  try {
    const data = await Collection.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
};

exports.postCollection = async (req, res) => {
  try {
    const input = req.body;  // This will either be a single collection or an array of collections

    // Check if the input is an array
    if (Array.isArray(input)) {
      // For multiple collections, first check if any of them already exist
      const existingCollections = await Collection.find({ name: { $in: input.map(item => item.name) } });

      // If any collections already exist, return an error
      if (existingCollections.length > 0) {
        return res.status(400).json({
          error: 'Some collections already exist',
          existing: existingCollections.map(item => item.name)
        });
      }

      // Insert multiple collections if none exist
      const collections = await Collection.insertMany(input);
      res.status(201).json(collections);
    } else {
      // For a single collection, check if it exists
      const exists = await Collection.findOne({ name: input.name });

      if (exists) {
        return res.status(400).json({ error: 'Collection already exists' });
      }

      // Insert a single collection
      const collection = new Collection(input);
      await collection.save();
      res.status(201).json(collection);
    }
  } catch (err) {
    res.status(400).json({ error: 'Failed to add collection(s)', details: err.message });
  }
};


exports.putCollection = async (req, res) => {
  try {
    const updated = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update collection' });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    await Collection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Collection deleted' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete collection' });
  }
};
