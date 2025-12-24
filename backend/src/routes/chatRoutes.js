const express = require('express');
const router = express.Router();
const { getConversations } = require('../controllers/chatController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/', protect, getConversations);

module.exports = router;
