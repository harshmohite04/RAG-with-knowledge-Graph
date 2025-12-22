const express = require('express');
const router = express.Router();
const { getBookings, createBooking } = require('../controllers/scheduleController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getBookings)
    .post(protect, createBooking);

module.exports = router;
