const express = require('express');
const router = express.Router();
const { getPortalHome } = require('../controllers/portalController');
const { protect } = require('../middlewares/authMiddleware');

router.get('/home', protect, getPortalHome);

module.exports = router;
