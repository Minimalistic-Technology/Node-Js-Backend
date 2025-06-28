import express from 'express';
import BookController from '../controllers/homepageController';

const router = express.Router();

// Category routes
router.get('/categories', BookController.getAllCategories);
router.post('/categories', BookController.createCategory);
router.get('/categories/:categoryName', BookController.getCategoryByNameWithBooks);
router.post('/categories/:categoryName', BookController.createBook);

// Book details route
router.get('/categories/:categoryName/:bookId', BookController.getBookDetailsById);


// Delete routes
router.delete('/categories', BookController.deleteAllCategories);
router.delete('/books', BookController.deleteAllBooks);

export default router;