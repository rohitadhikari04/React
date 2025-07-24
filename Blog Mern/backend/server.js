const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const session = require('express-session');

const app = express();
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

app.use(session({
  secret: 'secretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

app.listen(5000, () => console.log('Server running on port 5000'));
