import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const users = await User.find().sort({ totalPoints: -1, updatedAt: 1 });
  const leaderboard = users.map((u, idx) => ({
    rank: idx + 1,
    _id: u._id,
    name: u.name,
    totalPoints: u.totalPoints,
  }));
  res.json(leaderboard);
});

export default router;
