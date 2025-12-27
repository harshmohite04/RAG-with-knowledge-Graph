const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/unread/count', protect, messageController.getUnreadCount);
router.get('/:contactId', protect, messageController.getMessages);
router.post('/', protect, messageController.sendMessage);
router.put('/read/:contactId', protect, messageController.markMessagesRead);


module.exports = router;
