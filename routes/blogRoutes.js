const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.post('/', blogController.createBlog);
router.get('/', blogController.getAllBlogs);
router.get('/most-viewed', blogController.getMostViewedBlogs);
router.get('/most-recent', blogController.getMostRecentBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', blogController.updateBlog);
router.delete('/', blogController.deleteAllBlogs);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;