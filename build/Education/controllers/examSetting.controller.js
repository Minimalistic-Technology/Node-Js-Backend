"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSetting = exports.updateSetting = exports.getSettingByExam = exports.getSettings = exports.createSetting = void 0;
const examSetting_model_1 = require("../models/examSetting.model");
const createSetting = async (req, res) => {
    try {
        const setting = new examSetting_model_1.ExamSettingModel(req.body);
        const saved = await setting.save();
        res.status(201).json(saved);
    }
    catch {
        res.status(500).json({ error: 'Error creating exam setting' });
    }
};
exports.createSetting = createSetting;
const getSettings = async (_req, res) => {
    try {
        const settings = await examSetting_model_1.ExamSettingModel.find();
        res.json(settings);
    }
    catch {
        res.status(500).json({ error: 'Error fetching settings' });
    }
};
exports.getSettings = getSettings;
const getSettingByExam = async (req, res) => {
    try {
        const setting = await examSetting_model_1.ExamSettingModel.findOne({ examId: req.params.examId });
        if (!setting) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }
        res.json(setting);
    }
    catch {
        res.status(500).json({ error: 'Error fetching setting' });
    }
};
exports.getSettingByExam = getSettingByExam;
const updateSetting = async (req, res) => {
    try {
        const updated = await examSetting_model_1.ExamSettingModel.findOneAndUpdate({ examId: req.params.examId }, req.body, { new: true });
        if (!updated) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }
        res.json(updated);
    }
    catch {
        res.status(500).json({ error: 'Error updating setting' });
    }
};
exports.updateSetting = updateSetting;
const deleteSetting = async (req, res) => {
    try {
        const deleted = await examSetting_model_1.ExamSettingModel.findOneAndDelete({ examId: req.params.examId });
        if (!deleted) {
            res.status(404).json({ error: 'Setting not found' });
            return;
        }
        res.json({ message: 'Setting deleted' });
    }
    catch {
        res.status(500).json({ error: 'Error deleting setting' });
    }
};
exports.deleteSetting = deleteSetting;
