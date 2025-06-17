import { Router } from 'express';
import testController from '../../controllers/hospital/test';

const router = Router();

// Route to get tests by starting letter
router.get('/tests/:letter', testController.getTestsByLetter);

// Route to append tests under a specific letter
router.post('/tests/:letter', testController.appendTestsByLetter);

// Route to append data to a specific test by ID
router.post('/tests/appendbyid/:id', testController.appendToTestById);

// Route to update a test by ID
router.put('/tests/:id', testController.updateTestById);

// Route to delete a test by ID
router.delete('/tests/:id', testController.deleteTestById);

// Route to add multiple tests at once
router.post('/tests', testController.addMultipleTests);

export default router;
