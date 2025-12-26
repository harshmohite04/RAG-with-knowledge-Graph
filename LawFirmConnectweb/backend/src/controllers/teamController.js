const Case = require('../models/Case');
const User = require('../models/User');
const TeamInvitation = require('../models/TeamInvitation');
const sendEmail = require('../utils/emailService');
const teamInvitationTemplate = require('../utils/teamInvitationTemplate');

// @desc    Validate if email belongs to a registered user
// @route   POST /cases/:caseId/team/validate
// @access  Private
const validateTeamMember = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Cannot add people outside the portal. User must be registered first.'
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Invite a team member
// @route   POST /cases/:caseId/team/invite
// @access  Private (Lead Attorney only)
const inviteTeamMember = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { email } = req.body;

        const caseDoc = await Case.findById(caseId);

        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }

        // Check if user is lead attorney
        if (caseDoc.leadAttorneyId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Only the lead attorney can invite team members');
        }

        // Find the user to invite
        const userToInvite = await User.findOne({ email: email.toLowerCase() });

        if (!userToInvite) {
            res.status(404);
            throw new Error('User not found. They must be registered on the portal first.');
        }

        // Check if already a team member
        const isAlreadyMember = caseDoc.teamMembers.some(
            member => member.userId.toString() === userToInvite._id.toString()
        );

        if (isAlreadyMember) {
            res.status(400);
            throw new Error('User is already a team member');
        }

        // Check if invitation already exists
        const existingInvitation = await TeamInvitation.findOne({
            caseId,
            invitedEmail: email.toLowerCase(),
            status: 'pending',
            expiresAt: { $gt: new Date() }
        });

        if (existingInvitation) {
            res.status(400);
            throw new Error('An invitation has already been sent to this user');
        }

        // Create invitation
        const invitation = await TeamInvitation.create({
            caseId,
            invitedBy: req.user._id,
            invitedEmail: email.toLowerCase(),
            invitedUserId: userToInvite._id
        });

        // Send email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const acceptLink = `${frontendUrl}/team/invitations/${invitation.token}/accept`;
        const rejectLink = `${frontendUrl}/team/invitations/${invitation.token}/reject`;

        const emailHtml = teamInvitationTemplate(
            `${req.user.firstName} ${req.user.lastName}`,
            caseDoc.title,
            caseDoc.category,
            acceptLink,
            rejectLink
        );

        await sendEmail({
            email: userToInvite.email,
            subject: 'Team Invitation - LawFirmConnect',
            html: emailHtml
        });

        res.status(201).json({
            success: true,
            invitation: {
                id: invitation._id,
                email: invitation.invitedEmail,
                status: invitation.status,
                expiresAt: invitation.expiresAt,
                invitedUser: {
                    firstName: userToInvite.firstName,
                    lastName: userToInvite.lastName
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Accept team invitation
// @route   POST /team/invitations/:token/accept
// @access  Public (with token)
const acceptInvitation = async (req, res, next) => {
    try {
        const { token } = req.params;

        const invitation = await TeamInvitation.findOne({
            token,
            status: 'pending',
            expiresAt: { $gt: new Date() }
        }).populate('caseId');

        if (!invitation) {
            res.status(404);
            throw new Error('Invitation not found or has expired');
        }

        // Update invitation status
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date();
        await invitation.save();

        // Add user to team
        const caseDoc = invitation.caseId;
        caseDoc.teamMembers.push({
            userId: invitation.invitedUserId,
            joinedAt: new Date()
        });
        await caseDoc.save();

        res.json({
            success: true,
            message: 'You have successfully joined the team',
            case: {
                id: caseDoc._id,
                title: caseDoc.title,
                category: caseDoc.category
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject team invitation
// @route   POST /team/invitations/:token/reject
// @access  Public (with token)
const rejectInvitation = async (req, res, next) => {
    try {
        const { token } = req.params;

        const invitation = await TeamInvitation.findOne({
            token,
            status: 'pending',
            expiresAt: { $gt: new Date() }
        });

        if (!invitation) {
            res.status(404);
            throw new Error('Invitation not found or has expired');
        }

        invitation.status = 'rejected';
        await invitation.save();

        res.json({
            success: true,
            message: 'Invitation declined'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove team member
// @route   DELETE /cases/:caseId/team/members/:userId
// @access  Private (Lead Attorney only)
const removeTeamMember = async (req, res, next) => {
    try {
        const { caseId, userId } = req.params;

        const caseDoc = await Case.findById(caseId);

        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }

        // Check if user is lead attorney
        if (caseDoc.leadAttorneyId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Only the lead attorney can remove team members');
        }

        // Remove member
        caseDoc.teamMembers = caseDoc.teamMembers.filter(
            member => member.userId.toString() !== userId
        );

        await caseDoc.save();

        res.json({
            success: true,
            message: 'Team member removed successfully'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Leave team
// @route   POST /cases/:caseId/team/leave
// @access  Private
const leaveTeam = async (req, res, next) => {
    try {
        const { caseId } = req.params;

        const caseDoc = await Case.findById(caseId);

        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }

        // Check if user is lead attorney
        if (caseDoc.leadAttorneyId.toString() === req.user._id.toString()) {
            res.status(400);
            throw new Error('Lead attorney cannot leave. Please transfer leadership first.');
        }

        // Check if user is a team member
        const isMember = caseDoc.teamMembers.some(
            member => member.userId.toString() === req.user._id.toString()
        );

        if (!isMember) {
            res.status(400);
            throw new Error('You are not a member of this team');
        }

        // Remove user from team
        caseDoc.teamMembers = caseDoc.teamMembers.filter(
            member => member.userId.toString() !== req.user._id.toString()
        );

        await caseDoc.save();

        res.json({
            success: true,
            message: 'You have left the team'
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update lead attorney
// @route   PATCH /cases/:caseId/team/lead
// @access  Private (Lead Attorney only)
const updateLeadAttorney = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { newLeadId } = req.body;

        const caseDoc = await Case.findById(caseId);

        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }

        // Check if user is current lead attorney
        if (caseDoc.leadAttorneyId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Only the current lead attorney can transfer leadership');
        }

        // Check if new lead is a team member
        const isTeamMember = caseDoc.teamMembers.some(
            member => member.userId.toString() === newLeadId
        );

        if (!isTeamMember) {
            res.status(400);
            throw new Error('New lead attorney must be a team member');
        }

        caseDoc.leadAttorneyId = newLeadId;
        await caseDoc.save();

        res.json({
            success: true,
            message: 'Lead attorney updated successfully',
            newLeadId
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending invitations for a case
// @route   GET /cases/:caseId/team/invitations
// @access  Private
const getTeamInvitations = async (req, res, next) => {
    try {
        const { caseId } = req.params;

        const invitations = await TeamInvitation.find({
            caseId,
            status: 'pending',
            expiresAt: { $gt: new Date() }
        }).populate('invitedUserId', 'firstName lastName email');

        res.json({
            success: true,
            invitations: invitations.map(inv => ({
                id: inv._id,
                email: inv.invitedEmail,
                status: inv.status,
                expiresAt: inv.expiresAt,
                invitedUser: {
                    firstName: inv.invitedUserId.firstName,
                    lastName: inv.invitedUserId.lastName,
                    email: inv.invitedUserId.email
                }
            }))
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Directly add a team member (simplified flow)
// @route   POST /cases/:caseId/team/members
// @access  Private (Lead Attorney only)
const addTeamMember = async (req, res, next) => {
    try {
        const { caseId } = req.params;
        const { email, role } = req.body;

        const caseDoc = await Case.findById(caseId);
        if (!caseDoc) {
            res.status(404);
            throw new Error('Case not found');
        }

        // Check if user is lead attorney
        if (caseDoc.leadAttorneyId.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('Only the lead attorney can add team members');
        }

        const userToAdd = await User.findOne({ email: email.toLowerCase() });
        if (!userToAdd) {
            res.status(404);
            throw new Error('User not found. They must be registered on the portal first.');
        }

        // Check if already a member
        const isAlreadyMember = caseDoc.teamMembers.some(
            member => member.userId.toString() === userToAdd._id.toString()
        );

        if (isAlreadyMember) {
            res.status(400);
            throw new Error('User is already a team member');
        }

        // Add to teamMembers
        caseDoc.teamMembers.push({
            userId: userToAdd._id,
            role: role || 'Member',
            joinedAt: new Date()
        });

        // Add to assignedLawyers (for visibility logic)
        if (!caseDoc.assignedLawyers.includes(userToAdd._id)) {
            caseDoc.assignedLawyers.push(userToAdd._id);
        }

        await caseDoc.save();

        res.status(201).json({
            success: true,
            user: {
                id: userToAdd._id,
                firstName: userToAdd.firstName,
                lastName: userToAdd.lastName,
                email: userToAdd.email,
                role: role || 'Member'
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    validateTeamMember,
    inviteTeamMember,
    acceptInvitation,
    rejectInvitation,
    removeTeamMember,
    leaveTeam,
    updateLeadAttorney,
    getTeamInvitations,
    addTeamMember
};
