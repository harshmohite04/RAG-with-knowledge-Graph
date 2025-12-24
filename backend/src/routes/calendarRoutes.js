const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/calendarController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getEvents)
    .post(protect, createEvent);

module.exports = router;
