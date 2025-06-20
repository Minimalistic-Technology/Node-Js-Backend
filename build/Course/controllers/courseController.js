"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourseById = exports.getAllCourses = void 0;
const Course_1 = __importDefault(require("../models/Course"));
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course_1.default.find();
        res.json(courses);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
};
exports.getAllCourses = getAllCourses;
const getCourseById = async (req, res) => {
    try {
        const course = await Course_1.default.findById(req.params.id);
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json(course);
    }
    catch (err) {
        res.status(400).json({ error: 'Invalid course ID' });
    }
};
exports.getCourseById = getCourseById;
const createCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body;
        if (!title || !description || price == null) {
            res.status(400).json({ error: 'Title, description, and price are required' });
            return;
        }
        const newCourse = new Course_1.default({ title, description, price });
        await newCourse.save();
        res.status(201).json(newCourse);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createCourse = createCourse;
const updateCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json(course);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update course' });
    }
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    try {
        const course = await Course_1.default.findByIdAndDelete(req.params.id);
        if (!course) {
            res.status(404).json({ error: 'Course not found' });
            return;
        }
        res.json({ message: 'Course deleted successfully' });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete course' });
    }
};
exports.deleteCourse = deleteCourse;
