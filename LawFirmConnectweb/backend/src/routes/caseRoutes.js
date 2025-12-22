const express = require('express');
const router = express.Router();
const { getCases, createCase, updateCase } = require('../controllers/caseController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getCases)
    .post(protect, createCase);

router.route('/:id')
    .patch(protect, updateCase);

module.exports = router;
