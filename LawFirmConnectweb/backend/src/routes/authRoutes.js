const express = require('express');
const router = express.Router();
const { registerUser, verifyEmail, loginUser } = require('../controllers/authController');
const { check } = require('express-validator');

// Validation middleware can be added here or inside controller. 
// Adding basic validation for structure.

router.post('/register', registerUser);
router.post('/verify-email', verifyEmail);
router.post('/login', loginUser);

module.exports = router;
