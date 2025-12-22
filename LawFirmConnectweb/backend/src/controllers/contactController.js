const ContactQuery = require('../models/ContactQuery');
const sendEmail = require('../utils/emailService');

// @desc    Submit contact query
// @route   POST /contact
// @access  Public
const submitContactQuery = async (req, res, next) => {
    try {
        const { name, email, phone, message } = req.body;

        const query = await ContactQuery.create({
            name,
            email,
            phone,
            message
        });

        // Notify Admin
        try {
            await sendEmail({
                email: process.env.EMAIL_USER, // Sending to self/admin
                subject: 'New Contact Query - LawFirmConnect',
                message: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
            });
        } catch (emailError) {
            console.error("Failed to send admin notification", emailError);
        }

        res.status(201).json({ msg: 'Query received. We will contact you shortly.' });
    } catch (error) {
        next(error);
    }
};

module.exports = { submitContactQuery };
