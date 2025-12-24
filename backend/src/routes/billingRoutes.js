const express = require('express');
const router = express.Router({ mergeParams: true });
const { getBilling, addExpense } = require('../controllers/billingController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getBilling)
    .post(protect, addExpense);

module.exports = router;
