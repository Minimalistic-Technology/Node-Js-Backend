"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bmiController_1 = require("../controllers/bmiController");
const router = express_1.default.Router();
router.post('/bmi', bmiController_1.generateBmiPlan);
router.get('/bmi', bmiController_1.getAllBmiPlans);
router.get('/bmi/:id/plan', bmiController_1.getBmiFoodPlanById);
router.put('/bmi/:id', bmiController_1.updateBmiPlanById);
router.delete('/bmi/:id', bmiController_1.deleteBmiPlanById);
exports.default = router;
