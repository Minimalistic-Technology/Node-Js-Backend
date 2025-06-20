import { Request, Response } from 'express';
import { ExamSettingModel } from '../models/examSetting';

export const createSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const setting = new ExamSettingModel(req.body);
    const saved = await setting.save();
    res.status(201).json(saved);
  } catch {
    res.status(500).json({ error: 'Error creating exam setting' });
  }
};

export const getSettings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const settings = await ExamSettingModel.find();
    res.json(settings);
  } catch {
    res.status(500).json({ error: 'Error fetching settings' });
  }
};

export const getSettingByExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const setting = await ExamSettingModel.findOne({ examId: req.params.examId });
    if (!setting) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }
    res.json(setting);
  } catch {
    res.status(500).json({ error: 'Error fetching setting' });
  }
};

export const updateSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await ExamSettingModel.findOneAndUpdate(
      { examId: req.params.examId },
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }
    res.json(updated);
  } catch {
    res.status(500).json({ error: 'Error updating setting' });
  }
};

export const deleteSetting = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ExamSettingModel.findOneAndDelete({ examId: req.params.examId });
    if (!deleted) {
      res.status(404).json({ error: 'Setting not found' });
      return;
    }
    res.json({ message: 'Setting deleted' });
  } catch {
    res.status(500).json({ error: 'Error deleting setting' });
  }
};
