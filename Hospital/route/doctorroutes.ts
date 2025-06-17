import { Router } from 'express';
import doctorController from '../../controllers/hospital/doctorcontroller';

const router = Router();

// Route to get all doctors
router.get('/doctors', doctorController.getAllDoctors);

// Route to get unique starting alphabets of doctor names
router.get('/doctors/alphabets', doctorController.getAlphabets);

// Route to get doctors by starting letter
router.get('/doctors/alphabets/:letter', doctorController.getDoctorsByLetter);

// Route to create multiple doctors
router.post('/doctors', doctorController.createDoctors);

// Route to create a doctor under a specific letter
router.post('/doctors/:letter', doctorController.createDoctorForLetter);

// Route to get a specific doctor by ID
router.get('/doctor/:id', doctorController.getDoctorById);

// Route to delete all doctors
router.delete('/doctors', doctorController.deleteAllDoctors);

export default router;
