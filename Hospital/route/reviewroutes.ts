import { Router } from 'express';
import reviewController from '../../controllers/hospital/review';

const router = Router();

// Route to get all reviews
router.get('/reviews', reviewController.getReviews);

// Route to get a specific review by ID
router.get('/reviews/:id', reviewController.getReviewById);

// Route to create a new review
router.post('/reviews', reviewController.createReview);

// Route to update a review by ID
router.put('/reviews/:id', reviewController.updateReview);

// Route to delete a review by ID
router.delete('/reviews/:id', reviewController.deleteReview);

export default router;
