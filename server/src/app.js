const express = require('express');
const cors = require('cors');

const app = express();
const userRoutes = require('./routes/user.routes');
const authRoutes = require('../src/routes/auth.routes');
const messageRoutes = require('../src/routes/message.routes');
// middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());

// health check
app.get('/health', (_req, res) => {
    console.log('Health check hit');
    res.json({ ok: true })
});

app.use('/users', userRoutes);

app.use('/auth', authRoutes);

app.use('/messages', messageRoutes);

module.exports = app;
