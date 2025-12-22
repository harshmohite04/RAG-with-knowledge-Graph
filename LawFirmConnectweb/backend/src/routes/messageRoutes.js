const express = require('express');
const router = express.Router();
const { getMessages, sendMessage } = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/')
    .get(protect, getMessages)
    .post(protect, sendMessage);

module.exports = router;
