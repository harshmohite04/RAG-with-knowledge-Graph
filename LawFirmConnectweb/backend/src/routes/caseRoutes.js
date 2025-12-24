const express = require('express');
const router = express.Router();
const { getCases, createCase, updateCase, getCaseById, uploadDocument, deleteCase, deleteDocument } = require('../controllers/caseController');
const { protect } = require('../middlewares/authMiddleware');
const fileUpload = require('../middlewares/fileUpload');

router.route('/')
    .get(protect, getCases)
    .post(protect, fileUpload.array('files'), createCase);

router.route('/:id')
    .get(protect, getCaseById)
    .patch(protect, updateCase)
    .delete(protect, deleteCase);

router.post('/:id/documents', protect, fileUpload.array('files'), uploadDocument);
router.delete('/:id/documents/:documentId', protect, deleteDocument);

module.exports = router;
