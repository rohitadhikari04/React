
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Dashboard() {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/me', { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`, { withCredentials: true });
      fetchBlogs();
    } catch (err) {
      console.error('Error deleting blog:', err);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchBlogs();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Welcome {user?.username || 'Guest'}</h1>
        <Link to="/create" className="btn btn-success">
          Create New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs yet.</p>
      ) : (
        <div className="row">
          {blogs.map((blog) => (
            <div className="col-md-6 mb-4" key={blog._id}>
              <div className="card h-100 shadow-sm">
                {blog.image && (
                  <img
                    src={blog.image}
                    className="card-img-top"
                    alt={blog.title}
                    style={{ maxHeight: '250px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{blog.title}</h5>
                  <p className="card-text">{blog.content.slice(0, 150)}...</p>
                  <p className="text-muted mt-auto">
                    <strong>By:</strong> {blog.createdBy?.username || 'Unknown Author'}
                  </p>

                  {user && blog.createdBy?._id === user._id && (
                    <div className="mt-3 d-flex justify-content-between">
                      <Link to={`/edit/${blog._id}`} className="btn btn-outline-primary btn-sm">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="btn btn-outline-danger btn-sm"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
