import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// List users
router.get('/', async (req, res) => {
  const users = await User.find().sort({ createdAt: 1 });
  res.json(users);
});

// Create user
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) return res.status(400).json({ error: 'Name is required' });
    const user = await User.create({ name: name.trim() });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
