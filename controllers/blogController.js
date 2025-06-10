const Blog = require('../models/Blog');

// Create one or multiple blogs
exports.createBlog = async (req, res) => {
  try {
    const data = Array.isArray(req.body) ? req.body : [req.body];
    // Ensure date is converted to Date object if provided as string
    const processedData = data.map(blog => ({
      ...blog,
      date: blog.date ? new Date(blog.date) : new Date()
    }));
    const result = await Blog.insertMany(processedData);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('authorId', 'name'); // Optional: Populate author name
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get blog by ID and increment views
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } }, // Increment views by 1
      { new: true }
    ).populate('authorId', 'name');
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update blog
exports.updateBlog = async (req, res) => {
  try {
    // Convert date to Date object if provided
    if (req.body.date) {
      req.body.date = new Date(req.body.date);
    }
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('authorId', 'name');
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all blogs
exports.deleteAllBlogs = async (req, res) => {
  try {
    const result = await Blog.deleteMany({});
    res.json({ message: `${result.deletedCount} blogs deleted successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get most viewed blogs
exports.getMostViewedBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default to 10 blogs
    const blogs = await Blog.find()
      .sort({ views: -1 }) // Sort by views in descending order
      .limit(limit)
      .populate('authorId', 'name');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get most recent blogs
exports.getMostRecentBlogs = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default to 10 blogs
    const blogs = await Blog.find()
      .sort({ date: -1 }) // Sort by date in descending order
      .limit(limit)
      .populate('authorId', 'name');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};