import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import userRouter from './routes/users.js';
import claimRouter from './routes/claim.js';
import leaderboardRouter from './routes/leaderboard.js';
import historyRouter from './routes/history.js';
import { ensureSeedUsers } from './seed/seedUsers.js';

dotenv.config();

const app = express();
app.use(express.json());

// CORS
const origins = (process.env.FRONTEND_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: function(origin, cb){
    // allow non-browser like curl/postman (no origin) and configured origins
    if (!origin || origins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// HTTP server + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: origins.length ? origins : '*' }
});
app.set('io', io); // make io available on app - used in routes

// Mongo
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leaderboard_db';
await mongoose.connect(MONGODB_URI);

// Seed users if needed
await ensureSeedUsers();

// Routes
app.use('/api/users', userRouter);
app.use('/api/claim', claimRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/history', historyRouter);

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}`);
});
