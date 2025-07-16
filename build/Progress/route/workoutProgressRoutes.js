"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workoutProgressController_1 = require("../controllers/workoutProgressController");
const router = express_1.default.Router();
router.post('/progress', workoutProgressController_1.createProgress);
router.get('/progress', workoutProgressController_1.getProgress);
router.put('/progress/:id', workoutProgressController_1.updateProgress);
router.delete('/progress/:id', workoutProgressController_1.deleteProgress);
exports.default = router;
