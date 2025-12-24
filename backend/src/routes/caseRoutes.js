const express = require('express');
const router = express.Router();
const { 
    getCaseById, 
    updateCase, 
    deleteCase, 
    createCase, 
    addTeamMember, 
    removeTeamMember,
    getCases,
    uploadDocument,
    getDocuments
} = require('../controllers/caseController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../utils/fileUpload');
const activityRoutes = require('./activityRoutes');
const billingRoutes = require('./billingRoutes');
const caseMessageRoutes = require('./caseMessageRoutes');

// Mount routers
router.use('/:caseId/activities', activityRoutes);
router.use('/:caseId/billing', billingRoutes);
router.use('/:caseId/messages', caseMessageRoutes);

router.route('/')
    .get(protect, getCases)
    .post(protect, upload.array('documents'), createCase);

router.route('/:id/documents')
    .get(protect, getDocuments);

router.route('/:id/documents/upload')
    .post(protect, upload.single('file'), uploadDocument);

router.route('/:id')
    .get(protect, getCaseById)
    .put(protect, updateCase)
    .delete(protect, deleteCase);

router.route('/:id/team')
    .post(protect, addTeamMember);

router.route('/:id/team/:userId')
    .delete(protect, removeTeamMember);

module.exports = router;
