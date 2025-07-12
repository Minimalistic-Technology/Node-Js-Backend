"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_1 = __importDefault(require("../../controllers/figma/event"));
const job_1 = __importDefault(require("../../controllers/figma/job"));
const alphabet_1 = __importDefault(require("../../controllers/figma/alphabet"));
const labcontroller_1 = __importDefault(require("../../controllers/figma/labcontroller"));
const doctorcontroller_1 = __importDefault(require("../../controllers/figma/doctorcontroller"));
const router = express_1.default.Router();
// ---------- Doctor Routes ----------
router.get('/doctors/alphabets', doctorcontroller_1.default.getAlphabets);
router.get('/doctors/alphabets/:letter', doctorcontroller_1.default.getDoctorsByLetter);
router.post('/doctors/:letter', doctorcontroller_1.default.createDoctorForLetter);
router.get('/doctor/:id', doctorcontroller_1.default.getDoctorById);
// ---------- Lab Routes ----------
router.get('/alphabets', labcontroller_1.default.getAlphabets);
router.get('/labs/alphabets/:letter', labcontroller_1.default.getLabsByLetter);
router.get('/lab/alphabets/:id', labcontroller_1.default.getLabById);
router.post('/lab', labcontroller_1.default.createLab);
router.post('/labs/:letter', labcontroller_1.default.createLabForLetter);
router.post('/labs/:letter/bulk', labcontroller_1.default.bulkCreateLabsForLetter);
router.put('/lab/:id', labcontroller_1.default.updateLab);
router.delete('/lab/:id', labcontroller_1.default.deleteLab);
router.get('/event/labs/alphabets/:letter', labcontroller_1.default.getLabNamesByLetter);
router.get('/event/lab/alphabets/:id', labcontroller_1.default.getLabDetailsById);
// ---------- Job Routes ----------
router.get('/job', job_1.default.searchJobs);
router.get('/job/:jobId', job_1.default.getJobById);
router.post('/job', job_1.default.createJob);
router.put('/job/:jobId', job_1.default.updateJob);
router.delete('/job/:jobId', job_1.default.deleteJob);
// ---------- Event Routes ----------
router.get('/events', event_1.default.getAllEvents);
router.get('/event/:id', event_1.default.getEventById);
router.post('/events', event_1.default.createEvent);
router.put('/events/:id', event_1.default.updateEvent);
router.delete('/events/:id', event_1.default.deleteEvent);
// ---------- Disease / Alphabet Routes ----------
router.get('/alphabets', alphabet_1.default.getAlphabets);
router.post('/alphabet', alphabet_1.default.createAlphabet);
router.get('/diseases/:letter', alphabet_1.default.getDiseasesByLetter);
router.post('/diseases/:letter', alphabet_1.default.createDisease);
router.post('/diseases/bulk/:letter', alphabet_1.default.createDiseasesBulk);
router.get('/disease/:diseaseId', alphabet_1.default.getDiseaseById);
router.put('/disease/:diseaseId', alphabet_1.default.updateDisease);
router.delete('/disease/:diseaseId', alphabet_1.default.deleteDisease);
exports.default = router;
