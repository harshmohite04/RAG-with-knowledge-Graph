const express = require('express');
const router = express.Router({ mergeParams: true });
const { getActivities, addActivity } = require('../controllers/activityController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getActivities)
    .post(protect, addActivity);

module.exports = router;
