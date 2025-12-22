const express = require('express');
const router = express.Router();
const { submitContactQuery } = require('../controllers/contactController');

router.post('/', submitContactQuery);

module.exports = router;
