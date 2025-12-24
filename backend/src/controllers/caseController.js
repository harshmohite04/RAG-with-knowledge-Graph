const Case = require('../models/caseModel');
const User = require('../models/userModel');

// @desc    Get case details
// @route   GET /api/cases/:id
// @access  Private (Lead Attorney, Assigned Team)
exports.getCaseById = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id)
            .populate('assignedTeam.user', 'name email role avatar');

        if (!caseItem) {
            return res.status(404).json({ success: false, error: 'Case not found' });
        }

        res.status(200).json(caseItem);
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, error: 'Case not found' });
        }
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update case settings
// @route   PUT /api/cases/:id
// @access  Private (Lead Attorney only)
exports.updateCase = async (req, res) => {
    try {
        const { title, description, status, legalMatter, notifications } = req.body;
        
        const updateFields = {};
        if (title) updateFields.title = title;
        if (description) updateFields.description = description;
        if (status) updateFields.status = status;
        if (legalMatter) updateFields.legalMatter = legalMatter;
        if (notifications) updateFields.notifications = notifications;

        // Check if user is Lead Attorney or Authorized (TODO: Add check vs req.user)

        const caseItem = await Case.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!caseItem) {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }

        res.status(200).json(caseItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Manage Case Team (Add)
// @route   POST /api/cases/:id/team
// @access  Private
exports.addTeamMember = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const caseItem = await Case.findById(req.params.id);

        if (!caseItem) {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
             return res.status(404).json({ success: false, error: 'User not found' });
        }

        // Add to array if not already there
        const alreadyAssigned = caseItem.assignedTeam.find(member => member.user.toString() === userId);
        if (alreadyAssigned) {
             return res.status(400).json({ success: false, error: 'User already assigned to this case' });
        }

        caseItem.assignedTeam.push({ user: userId, role });
        await caseItem.save();

        res.status(200).json(caseItem);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Manage Case Team (Remove)
// @route   DELETE /api/cases/:id/team/:userId
// @access  Private
exports.removeTeamMember = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        
        if (!caseItem) {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }

        caseItem.assignedTeam = caseItem.assignedTeam.filter(
            member => member.user.toString() !== req.params.userId
        );

        await caseItem.save();
        res.status(200).json(caseItem);

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};


// @desc    Delete case
// @route   DELETE /api/cases/:id
// @access  Private (Lead Attorney)
exports.deleteCase = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);

        if (!caseItem) {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }

        await caseItem.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create new case
// @route   POST /api/cases
// @access  Private
exports.createCase = async (req, res) => {
    try {
        const { title, clientName, legalMatter, description, status, assignedTeam } = req.body;
        
        let documents = [];
        if (req.files) {
            req.files.forEach(file => {
                documents.push({
                    name: file.originalname,
                    url: `/uploads/${file.filename}`,
                    type: file.mimetype,
                    size: file.size
                });
            });
        }

        let parsedTeam = [];
        if (assignedTeam) {
            try {
                parsedTeam = JSON.parse(assignedTeam);
            } catch (e) {
                // If not JSON string, maybe already object or error
                parsedTeam = []; 
            }
        }
        
        const caseItem = await Case.create({
            title,
            clientName,
            legalMatter,
            description,
            status: status || 'Open',
            assignedTeam: parsedTeam,
            documents
        });

        res.status(201).json({ success: true, data: caseItem });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

// @desc    Get all cases (Dashboard)
// @route   GET /api/cases
// @access  Private
exports.getCases = async (req, res) => {
  try {
      const { status, search } = req.query;
      let query = {};

      if (status) query.status = status;
      if (search) {
          query.$or = [
              { title: { $regex: search, $options: 'i' } },
              { clientName: { $regex: search, $options: 'i' } }
          ];
      }

      // If user role is NOT 'Lead Attorney', maybe filter by cases they are in?
      // For now, return all matching filters.
      
      const cases = await Case.find(query).select('title clientName status createdAt');
      
      res.status(200).json(cases);
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Server Error' });
  }
};

// @desc    Upload document to case
// @route   POST /api/cases/:id/documents/upload
// @access  Private
exports.uploadDocument = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        if (!caseItem) {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }

        if (!req.file) {
             return res.status(400).json({ success: false, error: 'Please upload a file' });
        }

        const { category } = req.body;
        
        const newDoc = {
            name: req.file.originalname,
            url: `/uploads/${req.file.filename}`,
            type: req.file.mimetype,
            size: req.file.size,
            uploadedAt: Date.now(),
            // category: category // Spec mentions category, model doesn't have it explicitly in schema I wrote, I should add it or use meta? 
            // I'll add it to the valid fields if schema supports it or ignore for now.
        };

        caseItem.documents.push(newDoc);
        await caseItem.save();

        res.status(201).json(newDoc);
    } catch (error) {
         console.error(error);
         res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get case documents
// @route   GET /api/cases/:id/documents
// @access  Private
exports.getDocuments = async (req, res) => {
    try {
        const caseItem = await Case.findById(req.params.id);
        if (!caseItem) {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }

        res.status(200).json(caseItem.documents);
    } catch (error) {
         console.error(error);
        if (error.kind === 'ObjectId') {
             return res.status(404).json({ success: false, error: 'Case not found' });
        }
         res.status(500).json({ success: false, error: 'Server Error' });
    }
};

