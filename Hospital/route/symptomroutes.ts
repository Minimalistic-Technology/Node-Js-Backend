import { Router } from 'express';
import symptomController from '../../controllers/hospital/symptoms';

const router = Router();

// Route to get available starting alphabets of symptoms
router.get('/symptoms/alphabets', symptomController.getAlphabets);

// Route to get symptoms by starting letter
router.get('/symptoms/:letter', symptomController.getSymptomsByLetter);

// Route to create all symptoms at once
router.post('/symptoms/all', symptomController.createAllSymptoms);

// Route to create a symptom under a specific letter
router.post('/symptoms/:letter', symptomController.createSymptomForLetter);

// Route to bulk create symptoms for a specific letter
router.post('/symptoms/bulk/:letter', symptomController.createSymptomsBulk);

// Route to update a symptom by ID
router.put('/symptoms/:id', symptomController.updateSymptomById);

// Route to delete a symptom by ID
router.delete('/symptoms/:id', symptomController.deleteSymptomById);

export default router;
