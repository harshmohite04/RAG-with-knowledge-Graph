const express = require('express');
const router = express.Router();
const {
    validateTeamMember,
    inviteTeamMember,
    acceptInvitation,
    rejectInvitation,
    removeTeamMember,
    leaveTeam,
    updateLeadAttorney,
    getTeamInvitations
} = require('../controllers/teamController');
const { protect } = require('../middlewares/authMiddleware');

// Routes for case-specific team operations (requires authentication)
router.post('/:caseId/team/validate', protect, validateTeamMember);
router.post('/:caseId/team/invite', protect, inviteTeamMember);
router.get('/:caseId/team/invitations', protect, getTeamInvitations);
router.delete('/:caseId/team/members/:userId', protect, removeTeamMember);
router.post('/:caseId/team/leave', protect, leaveTeam);
router.patch('/:caseId/team/lead', protect, updateLeadAttorney);

// Public routes for invitation acceptance/rejection (token-based)
router.post('/invitations/:token/accept', acceptInvitation);
router.post('/invitations/:token/reject', rejectInvitation);

module.exports = router;
