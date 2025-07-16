"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const review_1 = require("../controllers/review");
const labController = __importStar(require("../controllers/labcontroller"));
const jobController = __importStar(require("../controllers/job"));
const eventController = __importStar(require("../controllers/event"));
const doctorController = __importStar(require("../controllers/doctorcontroller"));
const diseaseController = __importStar(require("../controllers/alphabet"));
const symptomController = __importStar(require("../controllers/symptoms"));
const testController = __importStar(require("../controllers/test"));
const reviewController = __importStar(require("../controllers/review"));
const router = (0, express_1.Router)();
// --- Review Routes ---
router.get('/reviews', reviewController.getReviews);
router.get('/reviews/:id', reviewController.getReviewById);
router.post('/reviews', reviewController.createReview);
router.put('/reviews/:id', reviewController.updateReview);
router.delete('/reviews/:id', reviewController.deleteReview);
// --- Test Routes ---
router.get('/tests/:letter', testController.getTestsByLetter);
router.post('/tests/:letter', testController.appendTestsByLetter);
router.post('/tests/appendbyid/:id', testController.appendToTestById);
router.put('/tests/:id', testController.updateTestById);
router.delete('/tests/:id', testController.deleteTestById);
router.post('/tests', testController.addMultipleTests);
// --- Symptom Routes ---
router.get('/symptoms/alphabets', symptomController.getAlphabets);
router.get('/symptoms/:letter', symptomController.getSymptomsByLetter);
router.post('/symptoms/all', symptomController.createAllSymptoms);
router.post('/symptoms/:letter', symptomController.createSymptomForLetter);
router.post('/symptoms/bulk/:letter', symptomController.createSymptomsBulk);
router.put('/symptoms/:id', symptomController.updateSymptomById);
router.delete('/symptoms/:id', symptomController.deleteSymptomById);
// --- Doctor Routes ---
router.get('/doctors', doctorController.getAllDoctors);
router.get('/doctors/alphabets', doctorController.getAlphabets);
router.get('/doctors/alphabets/:letter', doctorController.getDoctorsByLetter);
router.get('/doctor/:id', doctorController.getDoctorById);
router.post('/doctors', doctorController.createDoctors);
router.post('/doctors/:letter', doctorController.createDoctorForLetter);
router.delete('/doctors', doctorController.deleteAllDoctors);
// --- Event Routes ---
router.get('/events', eventController.getAllEvents);
router.get('/event/:id', eventController.getEventById);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);
// --- Job Routes ---
router.get('/job', jobController.searchJobs);
router.get('/job/:jobId', jobController.getJobById);
router.post('/job', jobController.createJob);
router.put('/job/:jobId', jobController.updateJob);
router.delete('/job/:jobId', jobController.deleteJob);
// --- Lab Routes ---
router.get('/labs/alphabets', labController.getAlphabets);
router.get('/labs/alphabets/:letter', labController.getLabsByLetter);
router.get('/lab/alphabets/:id', labController.getLabById);
router.post('/lab', labController.createLab);
router.post('/labs/:letter', labController.createLabForLetter);
router.post('/labs/:letter/bulk', labController.bulkCreateLabsForLetter);
router.put('/lab/:id', labController.updateLab);
router.delete('/lab/:id', labController.deleteLab);
router.get('/event/labs/alphabets/:letter', labController.getLabNamesByLetter);
router.get('/event/lab/alphabets/:id', labController.getLabDetailsById);
// --- Disease Routes ---
router.get('/diseases/alphabets', diseaseController.getAlphabets);
router.post('/alphabets', diseaseController.createAlphabet);
router.post('/diseases/all', diseaseController.createAllDiseases);
router.get('/diseases/:letter', diseaseController.getDiseasesByLetter);
router.post('/diseases/:letter', diseaseController.createDisease);
router.post('/diseases/bulk/:letter', diseaseController.createDiseasesBulk);
router.get('/diseases/id/:diseaseId', diseaseController.getDiseaseById);
router.put('/diseases/id/:diseaseId', diseaseController.updateDisease);
router.delete('/diseases/id/:diseaseId', diseaseController.deleteDisease);
// --- Optional: Remove these if already covered above ---
router.post('/', review_1.createReview);
router.get('/', review_1.getReviews);
router.get('/:id', review_1.getReviewById);
exports.default = router;
