const express = require('express');
const router = express.Router();
const { getCases, createCase, updateCase, getCaseById } = require('../controllers/caseController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getCases)
    .post(protect, require('../middlewares/fileUpload').array('files'), createCase);

router.route('/:id')
    .get(protect, getCaseById)
    .patch(protect, updateCase);

module.exports = router;
