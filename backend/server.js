require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const path = require('path');

const app = express();

// Connect DB
connectDB();

app.use(express.json());
app.use(cors());
app.use(logger);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/test', require('./routes/testRoutes'));

// static frontend (if you want to serve minimal pages)
app.use(express.static(path.join(__dirname, '../Frontend')));

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
