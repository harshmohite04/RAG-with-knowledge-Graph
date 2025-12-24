const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCaseMessages, sendCaseMessage } = require('../controllers/caseMessageController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getCaseMessages)
    .post(protect, sendCaseMessage);

module.exports = router;
