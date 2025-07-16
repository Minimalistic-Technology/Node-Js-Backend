"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const doctorcontroller_1 = __importDefault(require("../../controllers/hospital/doctorcontroller"));
const router = (0, express_1.Router)();
// Route to get all doctors
router.get('/doctors', doctorcontroller_1.default.getAllDoctors);
// Route to get unique starting alphabets of doctor names
router.get('/doctors/alphabets', doctorcontroller_1.default.getAlphabets);
// Route to get doctors by starting letter
router.get('/doctors/alphabets/:letter', doctorcontroller_1.default.getDoctorsByLetter);
// Route to create multiple doctors
router.post('/doctors', doctorcontroller_1.default.createDoctors);
// Route to create a doctor under a specific letter
router.post('/doctors/:letter', doctorcontroller_1.default.createDoctorForLetter);
// Route to get a specific doctor by ID
router.get('/doctor/:id', doctorcontroller_1.default.getDoctorById);
// Route to delete all doctors
router.delete('/doctors', doctorcontroller_1.default.deleteAllDoctors);
exports.default = router;
