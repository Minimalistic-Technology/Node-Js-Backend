import { Router } from 'express';
import diseaseController from '../../controllers/hospital/alphabet';

const router = Router();

// Route to get doctor name starting alphabets (possibly shared logic)
router.get('/doctors/alphabets', diseaseController.getAlphabets);

// Route to create a new alphabet entry
router.post('/alphabets', diseaseController.createAlphabet);

// Route to create all diseases at once (should be defined before :letter to avoid route conflict)
router.post('/diseases/all', diseaseController.createAllDiseases);

// Route to get diseases by starting letter
router.get('/diseases/:letter', diseaseController.getDiseasesByLetter);

// Route to create a single disease for a specific letter
router.post('/diseases/:letter', diseaseController.createDisease);

// Route to bulk create diseases for a specific letter
router.post('/diseases/bulk/:letter', diseaseController.createDiseasesBulk);

// Route to get a specific disease by ID
router.get('/diseases/id/:diseaseId', diseaseController.getDiseaseById);

// Route to update a disease by ID
// (Assuming you left this one out accidentally — here's the corrected line)
router.put('/diseases/id/:diseaseId', diseaseController.updateDiseaseById);

export default router;
