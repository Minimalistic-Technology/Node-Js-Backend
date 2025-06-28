"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedback_controller_1 = require("../controllers/feedback.controller");
const router = express_1.default.Router();
router.post('/feedback', feedback_controller_1.postFeedback);
router.get('/feedback', feedback_controller_1.getFeedback);
router.put('/feedback/:id', feedback_controller_1.updateFeedback);
router.delete('/feedback/:id', feedback_controller_1.deleteFeedback);
exports.default = router;
