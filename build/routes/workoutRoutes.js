"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workoutController_1 = require("../Progress/controller/workoutController");
const router = express_1.default.Router();
router.post('/workouts', workoutController_1.createWorkout);
router.get('/workouts', workoutController_1.getWorkouts);
router.put('/workouts/:id', workoutController_1.updateWorkout);
router.delete('/workouts/:id', workoutController_1.deleteWorkout);
exports.default = router;
