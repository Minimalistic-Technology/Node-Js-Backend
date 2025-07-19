import { Router } from 'express';
import { BookController } from '../controllers/contentController';

const router = Router();
// Routes
router.get('/', BookController.getAllBooks);
router.get('/categories', BookController.getCategories);
router.get('/:id', BookController.getBookById);
router.post('/', BookController.createBook);
router.post('/content', BookController.createBook); // New endpoint
router.put('/:id', BookController.updateBook);
router.delete('/:id', BookController.deleteBook);

export default router;