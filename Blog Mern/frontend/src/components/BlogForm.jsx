

import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function BlogForm({ onBlogCreated }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    image: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await api.post('/blogs', form, { withCredentials: true });

      alert(res.data.message);
      setForm({ title: '', content: '', image: '' });

      if (onBlogCreated) onBlogCreated();
      navigate('/dashboard');
    } catch (error) {
      console.error('Blog creation error:', error);
      alert('Failed to create blog: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="card shadow-sm p-4">
        <h3 className="mb-4">Add Blog</h3>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            placeholder="Enter blog title"
            value={form.title}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            name="image"
            className="form-control"
            placeholder="Enter image URL"
            value={form.image}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Content</label>
          <textarea
            name="content"
            className="form-control"
            placeholder="Write your blog content here"
            value={form.content}
            onChange={handleChange}
            rows="5"
          />
        </div>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Add Blog
        </button>
      </div>
    </div>
  );
}

export default BlogForm;
