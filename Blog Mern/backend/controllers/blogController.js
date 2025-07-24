const Blog = require('../models/blogModel');

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.session.userId) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }

    const blog = new Blog({
      title,
      content,
      image,
      createdBy: req.session.userId
    });

    await blog.save();
    res.json({ message: 'Blog created successfully' });

  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Fetch all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('createdBy', 'username');
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Fetch one blog by ID
exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).populate('createdBy', 'username');
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Update blog (only author)
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.createdBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this blog' });
    }

    const { title, content, image } = req.body;
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.image = image || blog.image;

    await blog.save();
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

// Delete blog (only author)
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.createdBy.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};
