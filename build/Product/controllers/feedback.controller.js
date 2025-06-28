"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFeedback = exports.updateFeedback = exports.getFeedback = exports.postFeedback = void 0;
const feedback_model_1 = require("../models/feedback.model");
const postFeedback = async (req, res) => {
    try {
        const feedback = new feedback_model_1.FeedbackModel(req.body);
        const saved = await feedback.save();
        res.status(201).json(saved);
    }
    catch {
        res.status(500).json({ error: 'Error submitting feedback' });
    }
};
exports.postFeedback = postFeedback;
const getFeedback = async (_req, res) => {
    try {
        const feedbacks = await feedback_model_1.FeedbackModel.find();
        res.json(feedbacks);
    }
    catch {
        res.status(500).json({ error: 'Error fetching feedback' });
    }
};
exports.getFeedback = getFeedback;
const updateFeedback = async (req, res) => {
    try {
        const updated = await feedback_model_1.FeedbackModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }
        res.json(updated);
    }
    catch {
        res.status(500).json({ error: 'Error updating feedback' });
    }
};
exports.updateFeedback = updateFeedback;
const deleteFeedback = async (req, res) => {
    try {
        const deleted = await feedback_model_1.FeedbackModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            res.status(404).json({ error: 'Feedback not found' });
            return;
        }
        res.json({ message: 'Feedback deleted' });
    }
    catch {
        res.status(500).json({ error: 'Error deleting feedback' });
    }
};
exports.deleteFeedback = deleteFeedback;
