

import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import BlogForm from './components/BlogForm';
// import Temp from './components/Temp';
import EditBlog from './components/EditBlog';


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<BlogForm />} />
        <Route path="/add-blog" element={<BlogForm />} />
        {/* Updated this route to handle dynamic :id */}
        <Route path="/edit/:id" element={<EditBlog />} />
    
      </Routes>
    </BrowserRouter>
  );
}

export default App;
