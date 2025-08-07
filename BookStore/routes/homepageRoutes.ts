import express from 'express';
import BookController from '../controllers/homepageController';
import {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  getApprovedReviewsByBookId,
} from '../controllers/reviewController';
import BookRequestController from '../controllers/addbookController';

const router = express.Router();


router.get('/book-categories', BookController.getAllCategories);
router.post('/book-categories', BookController.createCategory);
router.post('/book-categories/bulk', BookController.createBulkCategories);
router.get('/book-categories/:categoryName', BookController.getCategoryByName);
router.get('/book-categories/:categoryName/:subCategory', BookController.getSubCategory);
router.get('/book-categories/:categoryName/:subCategory/:subSubCategory', BookController.getSubSubCategory);
router.put('/book-categories/:id', BookController.updateCategory);
router.delete('/book-categories/:id', BookController.deleteCategory);
router.post('/book-categories/:categoryName/discount', BookController.setCategoryDiscount);
router.post('/book-categories/:categoryName/:subCategory/discount', BookController.setSubCategoryDiscount);


router.post('/book-categories/:categoryName/subcategories', BookController.createSubCategory);
router.delete('/book-categories/:categoryName/subcategories/:subCategoryName', BookController.deleteSubCategory);


router.post('/book-categories/:categoryName/:subCategory/subsubcategories', BookController.createSubSubCategory);
router.delete(
  '/book-categories/:categoryName/:subCategory/subsubcategories/:subSubCategoryName',
  BookController.deleteSubSubCategory
);


router.get('/book-categories/:categoryName/tags', BookController.getTagsByCategory);
router.post('/book-categories/:categoryName/tags', BookController.createTag);
router.put('/book-categories/:categoryName/tags/:tagName', BookController.updateTag);
router.delete('/book-categories/:categoryName/tags/:tagName', BookController.deleteTag);


router.get('/book-categories/:categoryName/:subCategory/:subSubCategory/tags', BookController.getTagsByCategory);
router.post('/book-categories/:categoryName/:subCategory/:subSubCategory/tags', BookController.createTag);
router.put('/book-categories/:categoryName/:subCategory/:subSubCategory/tags/:tagName', BookController.updateTag);
router.delete('/book-categories/:categoryName/:subCategory/:subSubCategory/tags/:tagName', BookController.deleteTag);


router.post('/book-categories/:categoryName/:subCategory/:subSubCategory', BookController.createBook);
router.get('/book-categories/:categoryName/:subCategory/:subSubCategory/:bookId', BookController.getBookDetailsById);
router.put('/book-categories/:categoryName/:subCategory/:subSubCategory/:bookId', BookController.updateBook);
router.delete('/book-categories/:categoryName/:subCategory/:subSubCategory/:bookId', BookController.deleteBook);

router.delete('/book-categories', BookController.deleteAllCategories);
router.delete('/books', BookController.deleteAllBooks);


router.get('/reviews', getReviews);
router.get('/reviews/book/:bookId', getApprovedReviewsByBookId);
router.post('/reviews', createReview);
router.get('/reviews/:id', getReviewById);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);


router.post('/book-requests', BookRequestController.createBookRequest);
router.get('/book-requests', BookRequestController.getBookRequests);

export default router;