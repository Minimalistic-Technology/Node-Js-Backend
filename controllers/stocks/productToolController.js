const ProductTool = require('../../models/stocks/productTool');

// Add one or multiple product tools
exports.addProductTool = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    const result = await ProductTool.insertMany(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all product tools
exports.getAllProductTools = async (req, res) => {
  try {
    const tools = await ProductTool.find();
    res.status(200).json(tools);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a product tool by ID
exports.getProductToolById = async (req, res) => {
  try {
    const tool = await ProductTool.findById(req.params.id);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });
    res.status(200).json(tool);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product tool by ID
exports.updateProductTool = async (req, res) => {
  try {
    const updated = await ProductTool.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updated) return res.status(404).json({ error: 'Tool not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product tool by ID
exports.deleteProductTool = async (req, res) => {
  try {
    const deleted = await ProductTool.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Tool not found' });
    res.status(200).json({ message: 'Tool deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
