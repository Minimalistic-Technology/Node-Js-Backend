"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const email_1 = require("../../controllers/figma/email");
const router = express_1.default.Router();
// POST /submit - Submit contact form
router.post('/submit', email_1.submitContactForm);
// GET /details - Get all contact submissions
router.get('/details', email_1.getContactDetails);
exports.default = router;
