const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Middleware
const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');

// Routes
const authRoutes = require('./src/routes/authRoutes');
const portalRoutes = require('./src/routes/portalRoutes');
const caseRoutes = require('./src/routes/caseRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const contactRoutes = require('./src/routes/contactRoutes');
const teamRoutes = require('./src/routes/teamRoutes');

const app = express();

// Security and utility middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://rag-with-knowledge-graph.vercel.app', 'https://rag-with-knowledge-graph.vercel.app/'],
    credentials: true
  })
);
// Allow all for now, or restrict to process.env.CLIENT_URL in production
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/portal', portalRoutes);
app.use('/cases', caseRoutes);
app.use('/schedule', scheduleRoutes);
app.use('/messages', messageRoutes);
app.use('/contact', contactRoutes);
app.use('/team', teamRoutes);
app.use('/uploads', express.static('uploads'));

// Health Check
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
