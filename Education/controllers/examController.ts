import { Request, Response } from "express";
import { ExamModel } from "../models/exam";

// Create
export const createExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = new ExamModel(req.body);
    await exam.save();
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({ error: "Failed to create exam" });
  }
};

// Read All
export const getAllExams = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exams = await ExamModel.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exams" });
  }
};

// Read by ID
export const getExamById = async (req: Request, res: Response): Promise<void> => {
  try {
    const exam = await ExamModel.findById(req.params.id);
    if (!exam)  res.status(404).json({ error: "Exam not found" });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exam" });
  }
};

// Update
export const updateExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedExam = await ExamModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedExam)  res.status(404).json({ error: "Exam not found" });
    res.json(updatedExam);
  } catch (error) {
    res.status(400).json({ error: "Failed to update exam" });
  }
};

// Delete
export const deleteExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ExamModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Exam not found" });
    res.json({ message: "Exam deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete exam" });
  }
};
