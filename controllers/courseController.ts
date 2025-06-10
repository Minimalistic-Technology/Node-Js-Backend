import { Request, Response } from 'express';
import Course from '../models/Course';

export const getAllCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err: any) {
    res.status(400).json({ error: 'Invalid course ID' });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, price } = req.body;

    if (!title || !description || price == null) {
      res.status(400).json({ error: 'Title, description, and price are required' });
      return;
    }

    const newCourse = new Course({ title, description, price });
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to update course' });
  }
};

export const deleteCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to delete course' });
  }
};
