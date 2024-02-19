const Blog = require('../models/blog');

exports.createBlog = async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.json(blogs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        Object.assign(blog, req.body);
        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        await blog.remove();
        res.json({ message: "Blog deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a comment to a blog post
exports.addComment = async (req, res) => {
    try {
        const blogId = req.params.id;
        const blog = await Blog.findById(blogId);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        const newComment = {
            userId: req.body.userId, // you can get the userId from the request
            text: req.body.text,
        };

        blog.comments.push(newComment);
        const updatedBlog = await blog.save();

        res.status(201).json(updatedBlog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getCommentsByBlogId = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.json(blog.comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};