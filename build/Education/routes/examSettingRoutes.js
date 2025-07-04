"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const examSettingController_1 = require("../controllers/examSettingController");
const router = express_1.default.Router();
router.post('/exam-settings', examSettingController_1.createSetting);
router.get('/exam-settings', examSettingController_1.getSettings);
router.get('/exam-settings/:examId', examSettingController_1.getSettingByExam);
router.put('/exam-settings/:examId', examSettingController_1.updateSetting);
router.delete('/exam-settings/:examId', examSettingController_1.deleteSetting);
exports.default = router;
