const Course = require('../models/Course');

exports.getAllCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
};

exports.createCourse = async (req, res) => {
  const { title, description, price } = req.body;
  const newCourse = new Course({ title, description, price });
  await newCourse.save();
  res.status(201).json(newCourse);
};

exports.updateCourse = async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json(course);
};

exports.deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ message: 'Course deleted successfully' });
};
