import { Router } from 'express';
import jobController from '../../controllers/hospital/job';

const router = Router();

// Route to search/filter jobs
router.get('/job', jobController.searchJobs);

// Route to get a job by ID
router.get('/job/:jobId', jobController.getJobById);

// Route to create a new job
router.post('/job', jobController.createJob);

// Route to update an existing job by ID
router.put('/job/:jobId', jobController.updateJob);

// Route to delete a job by ID
router.delete('/job/:jobId', jobController.deleteJob);

export default router;
