"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.getBlogById = exports.getAllBlogs = exports.createBlog = void 0;
const Blog_1 = __importDefault(require("../models/Blog"));
const createBlog = async (req, res) => {
    try {
        const blog = new Blog_1.default(req.body);
        await blog.save();
        res.status(201).json(blog);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createBlog = createBlog;
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog_1.default.find();
        res.json(blogs);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};
exports.getAllBlogs = getAllBlogs;
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog_1.default.findById(req.params.id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json(blog);
    }
    catch (err) {
        res.status(400).json({ error: 'Invalid blog ID' });
    }
};
exports.getBlogById = getBlogById;
const updateBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json(blog);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update blog' });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog_1.default.findByIdAndDelete(req.params.id);
        if (!blog) {
            res.status(404).json({ message: "Blog not found" });
            return;
        }
        res.json({ message: "Blog deleted successfully" });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete blog' });
    }
};
exports.deleteBlog = deleteBlog;
