const Billing = require('../models/billingModel');

// @desc    Get billing history
// @route   GET /api/cases/:id/billing
// @access  Private
exports.getBilling = async (req, res) => {
    try {
        const billingItems = await Billing.find({ caseId: req.params.caseId }).sort({ date: -1 });
        
        const formattedBilling = billingItems.map(item => ({
            id: item._id,
            date: item.date.toISOString().split('T')[0],
            description: item.description,
            amount: item.amount,
            status: item.status,
            category: item.category
        }));

        res.status(200).json(formattedBilling);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add expense
// @route   POST /api/cases/:id/billing
// @access  Private
exports.addExpense = async (req, res) => {
    try {
        const { category, description, amount, date, status } = req.body;

        const expense = await Billing.create({
            caseId: req.params.caseId,
            category,
            description,
            amount,
            date: date || Date.now(),
            status: status || 'Pending',
            // Receipt handling if file uploaded? Spec says receipt: "file_id". 
            // If file upload needed, add handling. Assuming simplistic for now.
        });

        res.status(201).json(expense);
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};
