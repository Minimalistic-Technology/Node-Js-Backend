"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_1 = __importDefault(require("../../controllers/hospital/test"));
const router = (0, express_1.Router)();
// Route to get tests by starting letter
router.get('/tests/:letter', test_1.default.getTestsByLetter);
// Route to append tests under a specific letter
router.post('/tests/:letter', test_1.default.appendTestsByLetter);
// Route to append data to a specific test by ID
router.post('/tests/appendbyid/:id', test_1.default.appendToTestById);
// Route to update a test by ID
router.put('/tests/:id', test_1.default.updateTestById);
// Route to delete a test by ID
router.delete('/tests/:id', test_1.default.deleteTestById);
// Route to add multiple tests at once
router.post('/tests', test_1.default.addMultipleTests);
exports.default = router;
