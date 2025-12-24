const express = require('express');
const router = express.Router();
const { createUser, getUserCases, searchUsers, getUserProfile, updateUserProfile, getUsers } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/search').get(protect, searchUsers);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

router.route('/')
    .post(createUser) // Or protect? The spec implies public signup is via auth/signup. This might be admin create? Leaving as is.
    .get(protect, getUsers);

router.route('/:id/cases')
    .get(getUserCases);

module.exports = router;
