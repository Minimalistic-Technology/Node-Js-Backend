"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const contactController_1 = require("../controllers/contactController");
const router = express_1.default.Router();
router.post('/contact', contactController_1.submitContactForm);
router.get('/contact', contactController_1.getContacts);
router.put('/contact/:id', contactController_1.updateContact);
router.delete('/contact/:id', contactController_1.deleteContact);
exports.default = router;
