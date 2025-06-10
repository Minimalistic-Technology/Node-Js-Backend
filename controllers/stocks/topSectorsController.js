const TopSectors = require('../../models/stocks/topSectorsModel');

// Add single or multiple sectors
exports.addTopSectors = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await TopSectors.insertMany(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all sectors
exports.getTopSectors = async (req, res) => {
  try {
    const data = await TopSectors.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update sector by ID
exports.updateTopSectors = async (req, res) => {
  try {
    const updated = await TopSectors.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    if (!updated) return res.status(404).json({ error: 'Sector not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete sector by ID
exports.deleteTopSectors = async (req, res) => {
  try {
    const deleted = await TopSectors.findByIdAndDelete(req.params.id);

    if (!deleted) return res.status(404).json({ error: 'Sector not found' });

    res.status(200).json({ message: 'Sector deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
