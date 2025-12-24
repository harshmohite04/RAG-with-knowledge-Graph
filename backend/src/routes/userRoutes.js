const express = require('express');
const router = express.Router({ mergeParams: true });
const { getCaseUsers, addUserToCase } = require('../controllers/userController');

// Mounted at /api/cases/:caseId/users
router.route('/')
    .get(getCaseUsers)
    .post(addUserToCase);

module.exports = router;
