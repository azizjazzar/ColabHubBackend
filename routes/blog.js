const express = require('express');
const router = express.Router();
const blogController = require('../controllers/BlogController');

// Basic CRUD operations for blogs
router.post('/addBlog', blogController.createBlog);
router.get('/blogs', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

// Comment-related routes
router.post('/:id/comments', blogController.addComment);
router.get('/:id/comments', blogController.getCommentsByBlogId);
// User-specific blogs route
router.get('/user/:userId/blogs', blogController.getBlogsByUser);

module.exports = router;
