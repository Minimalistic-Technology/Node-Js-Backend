"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const alphabet_1 = __importDefault(require("../../controllers/hospital/alphabet"));
const router = (0, express_1.Router)();
// Route to get doctor name starting alphabets (possibly shared logic)
router.get('/doctors/alphabets', alphabet_1.default.getAlphabets);
// Route to create a new alphabet entry
router.post('/alphabets', alphabet_1.default.createAlphabet);
// Route to create all diseases at once (should be defined before :letter to avoid route conflict)
router.post('/diseases/all', alphabet_1.default.createAllDiseases);
// Route to get diseases by starting letter
router.get('/diseases/:letter', alphabet_1.default.getDiseasesByLetter);
// Route to create a single disease for a specific letter
router.post('/diseases/:letter', alphabet_1.default.createDisease);
// Route to bulk create diseases for a specific letter
router.post('/diseases/bulk/:letter', alphabet_1.default.createDiseasesBulk);
// Route to get a specific disease by ID
router.get('/diseases/id/:diseaseId', alphabet_1.default.getDiseaseById);
// Route to update a disease by ID
// (Assuming you left this one out accidentally — here's the corrected line)
router.put('/diseases/id/:diseaseId', alphabet_1.default.updateDiseaseById);
exports.default = router;
