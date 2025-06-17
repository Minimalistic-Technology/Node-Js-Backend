"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const labcontroller_1 = __importDefault(require("../../controllers/hospital/labcontroller"));
const router = (0, express_1.Router)();
// Route to get list of alphabetized doctor initials
router.get('/doctors/alphabets', labcontroller_1.default.getAlphabets);
// Route to get labs by letter (full details)
router.get('/labs/alphabets/:letter', labcontroller_1.default.getLabsByLetter);
// Route to get lab by ID (full details)
router.get('/lab/alphabets/:id', labcontroller_1.default.getLabById);
// Route to create a new lab (general)
router.post('/lab', labcontroller_1.default.createLab);
// Route to create a new lab for a specific letter
router.post('/labs/:letter', labcontroller_1.default.createLabForLetter);
// Route to bulk create labs for a specific letter
router.post('/labs/:letter/bulk', labcontroller_1.default.bulkCreateLabsForLetter);
// Route to update a lab by ID
router.put('/lab/:id', labcontroller_1.default.updateLab);
// Route to delete a lab by ID
router.delete('/lab/:id', labcontroller_1.default.deleteLab);
// Route to get only lab names by letter
router.get('/event/labs/alphabets/:letter', labcontroller_1.default.getLabNamesByLetter);
// Route to get lab details (excluding name) by ID
router.get('/event/lab/alphabets/:id', labcontroller_1.default.getLabDetailsById);
exports.default = router;
