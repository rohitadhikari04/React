import express from 'express';
import User from '../models/User.js';
import ClaimHistory from '../models/ClaimHistory.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const points = Math.floor(Math.random() * 10) + 1; // 1-10
    user.totalPoints += points;
    await user.save();

    const claim = await ClaimHistory.create({ userId: user._id, points });

    // Emit Socket events
    const io = req.app.get('io');
    io.emit('claim:created', { userId: user._id.toString(), points, claim });
    io.emit('leaderboard:update'); // let clients refetch or update

    res.json({ user, points, claim });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
