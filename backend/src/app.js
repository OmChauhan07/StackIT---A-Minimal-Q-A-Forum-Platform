const express = require('express');
const app = express();

const mongoose = require('mongoose');

require('dotenv').config();

app.use(express.json());

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173', // or your frontend URL/port
  credentials: true
}));

const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/question');
const answerRoutes = require('./routes/answer');
const errorHandler = require('./middlewares/errorHandler');

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/answers', answerRoutes);
app.use(errorHandler);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;