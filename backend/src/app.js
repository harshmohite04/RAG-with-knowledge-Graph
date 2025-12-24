const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
const exampleRoutes = require('./routes/exampleRoutes');
const caseRoutes = require('./routes/caseRoutes');
const globalUserRoutes = require('./routes/globalUserRoutes');
const authRoutes = require('./routes/authRoutes');
const calendarRoutes = require('./routes/calendarRoutes');
const chatRoutes = require('./routes/chatRoutes');

app.use('/api/v1/example', exampleRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/users', globalUserRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/chats', chatRoutes);

// Health Check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

module.exports = app;
