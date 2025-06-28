import { Request, Response } from "express";
import { StudyMaterialModel } from "../models/studyMaterial";

export const createStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const material = new StudyMaterialModel(req.body);
    await material.save();
    res.status(201).json(material);
  } catch (err) {
    res.status(400).json({ error: "Failed to create study material" });
  }
};

export const getAllStudyMaterials = async (_req: Request, res: Response): Promise<void> => {
  try {
    const materials = await StudyMaterialModel.find();
    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch study materials" });
  }
};

export const getStudyMaterialById = async (req: Request, res: Response): Promise<void> => {
  try {
    const material = await StudyMaterialModel.findById(req.params.id);
    if (!material) {
     res.status(404).json({ error: "Not found" });
    }
    res.json(material);
  } catch (err) {
    res.status(500).json({ error: "Error fetching study material" });
  }
};

export const updateStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await StudyMaterialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)  res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update" });
  }
};

export const deleteStudyMaterial = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await StudyMaterialModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Not found" });
    res.json({ message: "Study material deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete" });
  }
};
