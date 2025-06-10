const express = require('express');
const router = express.Router();
const eventController = require('../../controllers/figma/event');
const jobController = require('../../controllers/figma/job');
const apiController = require('../../controllers/figma/alphabet');
const labController = require('../../controllers/figma/labcontroller');
const doctorController = require('../../controllers/figma/doctorcontroller');

// Route to get all available alphabets
router.get('/doctors/alphabets', doctorController.getAlphabets);

// Route to get doctors by letter (photo, name, specialist, location)
router.get('/doctors/alphabets/:letter', doctorController.getDoctorsByLetter);

// Route to create a new doctor for a specific letter
router.post('/doctors/:letter', doctorController.createDoctorForLetter);

// Route to get doctor details by ID
router.get('/doctor/:id', doctorController.getDoctorById);



router.get('/alphabets', labController.getAlphabets);
// Route to get labs by letter (full details)
router.get('/labs/alphabets/:letter', labController.getLabsByLetter);
// Route to get lab by ID (full details)
router.get('/lab/alphabets/:id', labController.getLabById);
// Route to create a new lab (general)
router.post('/lab', labController.createLab);
// Route to create a new lab for a specific letter
router.post('/labs/:letter', labController.createLabForLetter);
// Route to bulk create labs for a specific letter
router.post('/labs/:letter/bulk', labController.bulkCreateLabsForLetter);
// Route to update a lab by ID
router.put('/lab/:id', labController.updateLab);
// Route to delete a lab by ID
router.delete('/lab/:id', labController.deleteLab);
// Route to get only lab names by letter
router.get('/event/labs/alphabets/:letter', labController.getLabNamesByLetter);
// Route to get lab details (excluding name) by ID
router.get('/event/lab/alphabets/:id', labController.getLabDetailsById);

router.get('/job', jobController.searchJobs);
router.get('/job/:jobId', jobController.getJobById);
router.post('/job', jobController.createJob);
router.put('/job/:jobId', jobController.updateJob);
router.delete('/job/:jobId', jobController.deleteJob);

router.get('/events', eventController.getAllEvents);
router.get('/event/:id', eventController.getEventById);
router.post('/events', eventController.createEvent);
router.put('/events/:id', eventController.updateEvent);
router.delete('/events/:id', eventController.deleteEvent);

router.get('/alphabets', apiController.getAlphabets);
router.post('/alphabet', apiController.createAlphabet);
router.get('/diseases/:letter', apiController.getDiseasesByLetter);
router.post('/diseases/:letter', apiController.createDisease);
router.post('/diseases/bulk/:letter', apiController.createDiseasesBulk);
router.get('/disease/:diseaseId', apiController.getDiseaseById);
router.put('/disease/:diseaseId', apiController.updateDisease);
router.delete('/disease/:diseaseId', apiController.deleteDisease);

module.exports = router;