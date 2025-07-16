"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const feedbackController_1 = require("../controllers/feedbackController");
const router = express_1.default.Router();
router.post('/feedback', feedbackController_1.postFeedback);
router.get('/feedback', feedbackController_1.getFeedback);
router.put('/feedback/:id', feedbackController_1.updateFeedback);
router.delete('/feedback/:id', feedbackController_1.deleteFeedback);
exports.default = router;
