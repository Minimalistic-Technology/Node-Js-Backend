import { Request, Response } from "express";
import { StudentGradeModel } from "../models/studentGrade";

// Create
export const createGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const grade = new StudentGradeModel(req.body);
    await grade.save();
    res.status(201).json(grade);
  } catch (err) {
    res.status(400).json({ error: "Failed to create grade record" });
  }
};

// Get All
export const getAllGrades = async (_req: Request, res: Response): Promise<void> => {
  try {
    const grades = await StudentGradeModel.find();
    res.json(grades);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch grades" });
  }
};

// Get by ID
export const getGradeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const grade = await StudentGradeModel.findById(req.params.id);
    if (!grade)  res.status(404).json({ error: "Grade not found" });
    res.json(grade);
  } catch (err) {
    res.status(500).json({ error: "Error fetching grade" });
  }
};

// Update
export const updateGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await StudentGradeModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: "Grade not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update grade" });
  }
};

// Delete
export const deleteGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await StudentGradeModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Grade not found" });
    res.json({ message: "Grade deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete grade" });
  }
};
