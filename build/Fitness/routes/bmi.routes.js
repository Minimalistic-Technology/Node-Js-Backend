"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bmi_controller_1 = require("../controllers/bmi.controller");
const router = express_1.default.Router();
router.post('/bmi', bmi_controller_1.createBMI);
router.post('/bmi/batch', bmi_controller_1.batchBMI);
router.get('/bmi/:userId', bmi_controller_1.getBMIHistory);
router.put('/bmi/:id', bmi_controller_1.updateBMI);
router.delete('/bmi/:id', bmi_controller_1.deleteBMI);
exports.default = router;
