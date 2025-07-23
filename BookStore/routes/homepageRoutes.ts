import express from 'express';
import BookController from '../controllers/homepageController';
import { createReview, getReviews, getReviewById, updateReview, deleteReview, getApprovedReviewsByBookId } from '../controllers/reviewController';
import BookRequestController from '../controllers/addbookController';

const router = express.Router();

// Book category routes
router.get('/book-categories', BookController.getAllCategories);
router.post('/book-categories', BookController.createCategory);
router.get('/book-categories/:categoryName', BookController.getCategoryByNameWithBooks);
router.put('/book-categories/:id', BookController.updateCategory);
router.delete('/book-categories/:id', BookController.deleteCategory);

// Tag routes
router.get('/book-categories/:categoryName/tags', BookController.getTagsByCategory);
router.post('/book-categories/:categoryName/tags', BookController.createTag);
router.put('/book-categories/:categoryName/tags/:tagName', BookController.updateTag);
router.delete('/book-categories/:categoryName/tags/:tagName', BookController.deleteTag);

// Book routes
router.post('/book-categories/:categoryName', BookController.createBook);
router.get('/book-categories/:categoryName/:bookId', BookController.getBookDetailsById);
router.put('/book-categories/:categoryName/:bookId', BookController.updateBook);
router.delete('/book-categories/:categoryName/:bookId', BookController.deleteBook);

// Delete routes
router.delete('/book-categories', BookController.deleteAllCategories);
router.delete('/books', BookController.deleteAllBooks);

// Review routes
router.get('/reviews', getReviews);
router.get('/reviews/book/:bookId', getApprovedReviewsByBookId);
router.post('/reviews', createReview);
router.get('/reviews/:id', getReviewById);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Book request routes
router.post('/book-requests', BookRequestController.createBookRequest);
router.get('/book-requests', BookRequestController.getBookRequests);

export default router;