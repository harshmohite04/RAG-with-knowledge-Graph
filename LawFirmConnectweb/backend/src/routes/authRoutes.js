const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser, getCurrentUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const { check } = require('express-validator');

// Validation middleware can be added here or inside controller. 
// Adding basic validation for structure.

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);

module.exports = router;
