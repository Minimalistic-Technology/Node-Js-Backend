"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.post('/projects', projectController_1.createProject);
router.get('/projects', projectController_1.getProjects);
router.put('/projects/:id', projectController_1.updateProject);
router.delete('/projects/:id', projectController_1.deleteProject);
exports.default = router;
