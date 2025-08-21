import express from 'express';
import ClaimHistory from '../models/ClaimHistory.js';
import User from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const { userId, page = 1, limit = 10 } = req.query;
  const p = Math.max(parseInt(page) || 1, 1);
  const l = Math.min(Math.max(parseInt(limit) || 10, 1), 100);

  const filter = {};
  if (userId) filter.userId = userId;

  const [items, total] = await Promise.all([
    ClaimHistory.find(filter).sort({ createdAt: -1 }).skip((p-1)*l).limit(l).populate('userId', 'name'),
    ClaimHistory.countDocuments(filter)
  ]);

  res.json({
    page: p,
    limit: l,
    total,
    items: items.map(i => ({
      _id: i._id,
      userId: i.userId._id,
      userName: i.userId.name,
      points: i.points,
      createdAt: i.createdAt,
    }))
  });
});

export default router;
