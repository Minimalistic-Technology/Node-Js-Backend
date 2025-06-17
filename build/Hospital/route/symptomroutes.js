"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const symptoms_1 = __importDefault(require("../../controllers/hospital/symptoms"));
const router = (0, express_1.Router)();
// Route to get available starting alphabets of symptoms
router.get('/symptoms/alphabets', symptoms_1.default.getAlphabets);
// Route to get symptoms by starting letter
router.get('/symptoms/:letter', symptoms_1.default.getSymptomsByLetter);
// Route to create all symptoms at once
router.post('/symptoms/all', symptoms_1.default.createAllSymptoms);
// Route to create a symptom under a specific letter
router.post('/symptoms/:letter', symptoms_1.default.createSymptomForLetter);
// Route to bulk create symptoms for a specific letter
router.post('/symptoms/bulk/:letter', symptoms_1.default.createSymptomsBulk);
// Route to update a symptom by ID
router.put('/symptoms/:id', symptoms_1.default.updateSymptomById);
// Route to delete a symptom by ID
router.delete('/symptoms/:id', symptoms_1.default.deleteSymptomById);
exports.default = router;
