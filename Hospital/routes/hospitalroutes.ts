import { Router } from 'express';
import { createReview, getReviews, getReviewById } from '../controllers/review';
import * as labController from '../controllers/labcontroller';
import * as jobController from '../controllers/job';
import * as eventController from '../controllers/event';
import * as doctorController from '../controllers/doctorcontroller';
import * as diseaseController from '../controllers/alphabet';
import * as symptomController from '../controllers/symptoms';
import * as testController from '../controllers/test';
import * as reviewController from '../controllers/review';

const router: Router = Router();

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
router.post('/', createReview);
router.get('/', getReviews);
router.get('/:id', getReviewById);

export default router;
