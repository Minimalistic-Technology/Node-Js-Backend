import { Router } from 'express';
import labController from '../../controllers/hospital/labcontroller';

const router = Router();

// Route to get list of alphabetized doctor initials
router.get('/doctors/alphabets', labController.getAlphabets);

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

export default router;