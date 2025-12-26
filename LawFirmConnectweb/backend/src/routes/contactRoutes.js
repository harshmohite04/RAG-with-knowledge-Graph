const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middlewares/authMiddleware'); // Assuming auth middleware exists

router.get('/search', protect, contactController.searchUsers);
router.get('/search', protect, contactController.searchUsers);
router.post('/request', protect, contactController.sendRequest);
router.get('/requests/pending', protect, contactController.getRequests);
router.post('/request/:requestId/respond', protect, contactController.handleRequest);
router.get('/', protect, contactController.getContacts); // Still needed to get accepted friends

module.exports = router;
