const sendEmail = async (options) => {
    // Mock email service for now to avoid setting up SMTP
    console.log(`[Email Service] Sending email to ${options.email}`);
    console.log(`[Email Service] Subject: ${options.subject}`);
    console.log(`[Email Service] Message: ${options.message}`);
    return Promise.resolve();
};

module.exports = sendEmail;
