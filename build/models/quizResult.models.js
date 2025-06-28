"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizResultModel = void 0;
const mongoose_1 = require("mongoose");
// Create a Mongoose schema for the quiz result
const quizResultSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Course', required: true },
    quiz: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    answers: [
        {
            questionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Quiz.questions', required: true },
            selectedOption: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
        },
    ],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    completionDate: { type: Date, default: Date.now },
    task: { type: [String], default: [] }, // Array of strings for tasks
    isPassed: { type: Boolean, required: true }, // Pass or fail check
}, { timestamps: true });
quizResultSchema.methods.calculatePassOrFail = function (score, totalQuestions, passingScore) {
    this.isPassed = (this.score / totalQuestions) * 100 >= passingScore;
};
exports.QuizResultModel = (0, mongoose_1.model)('QuizResult', quizResultSchema);
