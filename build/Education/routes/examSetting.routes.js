"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const examSetting_controller_1 = require("../controllers/examSetting.controller");
const router = express_1.default.Router();
router.post('/exam-settings', examSetting_controller_1.createSetting);
router.get('/exam-settings', examSetting_controller_1.getSettings);
router.get('/exam-settings/:examId', examSetting_controller_1.getSettingByExam);
router.put('/exam-settings/:examId', examSetting_controller_1.updateSetting);
router.delete('/exam-settings/:examId', examSetting_controller_1.deleteSetting);
exports.default = router;
