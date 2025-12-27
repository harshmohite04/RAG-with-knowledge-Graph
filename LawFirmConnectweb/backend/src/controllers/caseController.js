const Case = require('../models/Case');

// @desc    Get all cases (Lawyer View)
// @route   GET /cases
// @access  Private
const getCases = async (req, res, next) => {
    try {
        // Default to returning NOTHING to be safe (recordStatus: 0 is effectively "deleted" but here we want to match nothing for active cases first)
        // Better: Default to a query that returns nothing valid for a normal user unless specific logic adds to it.
        // OR: Initialize query but rely on the role checks to populate it validly.
        

        // Unified query: User sees case if they are:
        // 1. Keeping strictly to "creator" (clientId)
        // 2. Assigned lawyer or Lead attorney
        // 3. Team member
        
        let query = {
             recordStatus: 1,
             $or: [
                 { clientId: req.user._id },
                 { assignedLawyers: req.user._id },
                 { leadAttorneyId: req.user._id },
                 { 'teamMembers.userId': req.user._id }
             ]
        };

        // Optional: Keep Admin override if needed, otherwise Admin also only sees their own.
        if (req.user.role === 'ADMIN') {
             query = { recordStatus: 1 };
        }


        const cases = await Case.find(query)
            .populate('leadAttorneyId', 'firstName lastName email')
            .populate('assignedLawyers', 'firstName lastName email')
            .sort({ createdAt: -1 });

        // Transform response to remove client info if needed, but usually frontend ignores it.
        // Spec said "REMOVED client object".
        const transformedCases = cases.map(c => ({
            _id: c._id,
            title: c.title,
            leadAttorney: c.leadAttorneyId ? { name: `${c.leadAttorneyId.firstName} ${c.leadAttorneyId.lastName}` } : null,
            status: c.status,
            recordStatus: c.recordStatus,
            createdAt: c.createdAt
        }));

        res.json(transformedCases);
    } catch (error) {
        next(error);
    }
};

// @desc    Create new case
// @route   POST /cases
// @access  Private
const createCase = async (req, res, next) => {
    try {
        const { title, description, legalMatter, assignedLawyers } = req.body;
        console.log('Backend createCase - req.files:', req.files);
        console.log('Backend createCase - req.body keys:', Object.keys(req.body));

        let documents = [];
        if (req.files) {
            documents = req.files.map(file => ({
                fileName: file.originalname,
                // Use location for S3, fallback to local path construction
                filePath: file.location || `/uploads/${file.filename}`,
                category: 'General',
                uploadedBy: req.user._id,
                fileSize: file.size,
                recordStatus: 1
            }));
        }
        
        // Parse assignedLawyers if sent as JSON string in FormData
        let lawyers = [];
        if (assignedLawyers) {
             try {
                // If it's a string, parse it. If array, use it.
                lawyers = typeof assignedLawyers === 'string' ? JSON.parse(assignedLawyers) : assignedLawyers;
             } catch(e) {
                 lawyers = [assignedLawyers]; // Fallback single ID
             }
        }

        if (req.user.role === 'ATTORNEY') {
            lawyers.push(req.user._id);
            // Ensure uniqueness
            lawyers = [...new Set(lawyers.map(id => id.toString()))];
        }

        let newCase;
        try {
            newCase = await Case.create({
                title,
                description,
                legalMatter, 
                clientId: req.user._id,
                assignedLawyers: lawyers,
                leadAttorneyId: req.user._id, // Assign creator as lead attorney
                status: 'Open',
                documents,
                recordStatus: 1,
                activityLog: [{
                    type: 'case_created',
                    description: `Case "${title}" created`,
                    performedBy: req.user._id,
                    createdAt: new Date()
                }]
            });
        } catch(dbError) {
             if(dbError.name === 'ValidationError') {
                 res.status(400);
                 throw new Error(`Validation Error: ${dbError.message}`);
             }
             throw dbError; 
        }

        res.status(201).json(newCase);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single case header/overview
// @route   GET /cases/:id
const getCaseById = async (req, res, next) => {
    try {
        const caseDoc = await Case.findOne({ _id: req.params.id, recordStatus: 1 })
            .populate('leadAttorneyId', 'firstName lastName email')
            .populate('assignedLawyers', 'firstName lastName email')
            .populate('teamMembers.userId', 'firstName lastName email')
            .populate('documents.uploadedBy', 'firstName lastName');

        if (!caseDoc) {
             res.status(404); throw new Error('Case not found');
        }
        res.json(caseDoc);
    } catch (error) { next(error); }
};

// @desc    Soft Delete case
// @route   DELETE /cases/:id/settings (or /cases/:id)
// Using standard DELETE /cases/:id for now as per spec
const deleteCase = async (req, res, next) => {
    try {
        const caseDoc = await Case.findById(req.params.id);
        if (!caseDoc) { res.status(404); throw new Error('Case not found'); }

        caseDoc.recordStatus = 0; // Soft delete
        await caseDoc.save();

        res.json({ message: 'Case deleted successfully' });
    } catch (error) { next(error); }
};

// --- TAB ENDPOINTS ---

// Documents
const getCaseDocuments = async (req, res, next) => {
    try {
        const caseDoc = await Case.findById(req.params.id).populate('documents.uploadedBy', 'firstName lastName');
        if (!caseDoc) { res.status(404); throw new Error('Case not found'); }
        
        const docs = caseDoc.documents.filter(d => d.recordStatus === 1);
        res.json(docs);
    } catch (error) { next(error); }
};

const uploadDocument = async (req, res, next) => {
    try {
        const { category } = req.body;
        if (!req.files) { res.status(400); throw new Error('No files'); }
        
        const caseDoc = await Case.findById(req.params.id);
        if (!caseDoc) { res.status(404); throw new Error('Case not found'); }

        const newDocs = req.files.map(f => ({
            fileName: f.originalname,
            filePath: f.location || `/uploads/${f.filename}`,
            category: category || 'General',
            uploadedBy: req.user._id,
            fileSize: f.size,
            recordStatus: 1
        }));
        
        caseDoc.documents.push(...newDocs);
        caseDoc.activityLog.push({
            type: 'document_uploaded',
            description: `Uploaded ${newDocs.length} documents`,
            performedBy: req.user._id
        });
        
        await caseDoc.save();
        res.status(201).json(caseDoc.documents.filter(d => d.recordStatus === 1));
    } catch (error) { next(error); }
};

const deleteDocument = async (req, res, next) => {
    try {
        const { id, documentId } = req.params;
        const caseDoc = await Case.findById(id);
        if (!caseDoc) { res.status(404); throw new Error('Case not found'); }

        const doc = caseDoc.documents.find(d => d._id.toString() === documentId);
        if (doc) {
            doc.recordStatus = 0; // Soft delete
            caseDoc.activityLog.push({
                type: 'document_deleted',
                description: `Deleted document ${doc.fileName}`,
                performedBy: req.user._id
            });
            await caseDoc.save();
        }
        res.json({ message: 'Document deleted' });
    } catch (error) { next(error); }
};

// Activity
const getCaseActivity = async (req, res, next) => {
    try {
        const caseDoc = await Case.findById(req.params.id).populate('activityLog.performedBy', 'firstName lastName');
        if (!caseDoc) { res.status(404); throw new Error('Case not found'); }
        res.json(caseDoc.activityLog.reverse());
    } catch (error) { next(error); }
};

const addCaseActivity = async (req, res, next) => {
    try {
        const { description, type } = req.body;
        const caseDoc = await Case.findById(req.params.id);
        if (!caseDoc) { res.status(404); throw new Error('Case not found'); }
        
        caseDoc.activityLog.push({
            type: type || 'general',
            description,
            performedBy: req.user._id,
            createdAt: new Date()
        });
        await caseDoc.save();
        res.status(201).json(caseDoc.activityLog);
    } catch (error) { next(error); }
};

// Billing
const getCaseBilling = async (req, res, next) => {
    try {
        const caseDoc = await Case.findById(req.params.id);
        res.json(caseDoc.billing || []);
    } catch (error) { next(error); }
};

const addCaseBilling = async (req, res, next) => {
    try {
        const { amount, description, status, date, category } = req.body;
        const caseDoc = await Case.findById(req.params.id);
        
        let receiptUrl = '';
        if (req.file) {
             // Supports both S3 (location) and Local (filename)
             receiptUrl = req.file.location || `/uploads/${req.file.filename}`;
        }

        caseDoc.billing.push({
            amount, description, status, date: date || new Date(), receiptUrl
        });
        await caseDoc.save();
        res.status(201).json(caseDoc.billing);
    } catch (error) { next(error); }
};

// Settings
const updateCaseSettings = async (req, res, next) => {
    try {
        const updates = req.body;
        const caseDoc = await Case.findById(req.params.id);
        
        if (updates.notifications) caseDoc.settings.notifications = { ...caseDoc.settings.notifications, ...updates.notifications };
        if (updates.title) caseDoc.title = updates.title;
        if (updates.description) caseDoc.description = updates.description;
        if (updates.status) caseDoc.status = updates.status;
        
        // Handle team add/remove if strictly requested via settings endpoint logic
        if (updates.team) {
            // updates.team.add = [{ userId, role }]
            // updates.team.remove = [userId]
            // This requires matching logic to assignedLawyers or teamMembers fields.
            // For now, simple direct field updates.
        }

        await caseDoc.save();
        res.json(caseDoc);
    } catch (error) { next(error); }
};

module.exports = {
    getCases, createCase, getCaseById, deleteCase, // Main
    getCaseDocuments, uploadDocument, deleteDocument, // Documents
    getCaseActivity, addCaseActivity, // Activity
    getCaseBilling, addCaseBilling, // Billing
    updateCaseSettings // Settings
};
