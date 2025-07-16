"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const profileController_1 = require("../../controllers/profileController");
const router = express_1.default.Router();
router.post('/profile', profileController_1.createProfile);
router.get('/profile', profileController_1.getProfile);
router.put('/profile', profileController_1.updateProfile);
exports.default = router;
