import express, { Router } from 'express';

import eventController from '../../controllers/figma/event';
import jobController from '../../controllers/figma/job';
import apiController from '../../controllers/figma/alphabet';
import labController from '../../controllers/figma/labcontroller';
import doctorController from '../../controllers/figma/doctorcontroller';

const router: Router = express.Router();

// ---------- Doctor Routes ----------
router.get('/doctors/alphabets', doctorController.getAlphabets);
router.get('/doctors/alphabets/:letter', doctorController.getDoctorsByLetter);
router.post('/doctors/:letter', doctorController.createDoctorForLetter);
router.get('/doctor/:id', doctorController.getDoctorById);

// ---------- Lab Routes ----------
router.get('/alphabets', labController.getAlphabets);
router.get('/labs/alphabets/:letter', labController.getLabsByLetter);
router.get('/lab/alphabets/:id', labController.getLabById);
router.post('/lab', labController.createLab);
router.post('/labs/:letter', labController.createLabForLetter);
router.post('/labs/:letter/bulk', labController.bulkCreateLabsForLetter);
router.put('/lab/:id', labController.updateLab);
router.delete('/lab/:id', labController.deleteLab);
router.get('/event/labs/alphabets/:letter', labController.getLabNamesByLetter);
router.get('/event/lab/alphabets/:id', labController.getLabDetailsById);

// ---------- Job Routes ----------
router.get('/job', jobController.searchJobs);
router.get('/job/:jobId', jobController.getJobById);
router.post('/job', jobController.createJob);
router.put('/job/:jobId', jobController.updateJob);
router.delete('/job/:jobId', jobController.deleteJob);

// ---------- Event Routes ----------
router.get('/events', eventController.getAllEvents);
router.get('/event/:id', eventController.getEventById);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

// ---------- Disease / Alphabet Routes ----------
router.get('/alphabets', apiController.getAlphabets);
router.post('/alphabet', apiController.createAlphabet);
router.get('/diseases/:letter', apiController.getDiseasesByLetter);
router.post('/diseases/:letter', apiController.createDisease);
router.post('/diseases/bulk/:letter', apiController.createDiseasesBulk);
router.get('/disease/:diseaseId', apiController.getDiseaseById);
router.put('/disease/:diseaseId', apiController.updateDisease);
router.delete('/disease/:diseaseId', apiController.deleteDisease);

export default router;
