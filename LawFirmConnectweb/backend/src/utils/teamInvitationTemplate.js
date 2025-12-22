const teamInvitationTemplate = (inviterName, caseName, caseCategory, acceptLink, rejectLink) => {
    return `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #334155;
            background-color: #f8fafc;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 40px 30px;
        }
        .content h2 {
            color: #1e293b;
            font-size: 20px;
            margin-top: 0;
        }
        .case-info {
            background-color: #f1f5f9;
            border-left: 4px solid #2563eb;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .case-info p {
            margin: 8px 0;
        }
        .case-info strong {
            color: #1e293b;
        }
        .buttons {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            display: inline-block;
            padding: 14px 32px;
            margin: 0 10px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 14px;
            transition: all 0.3s;
        }
        .btn-accept {
            background-color: #2563eb;
            color: #ffffff;
        }
        .btn-accept:hover {
            background-color: #1e40af;
        }
        .btn-reject {
            background-color: #e2e8f0;
            color: #475569;
        }
        .btn-reject:hover {
            background-color: #cbd5e1;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #64748b;
            border-top: 1px solid #e2e8f0;
        }
        .expiry-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #92400e;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤝 Team Invitation</h1>
        </div>
        <div class="content">
            <h2>You've been invited to join a case team!</h2>
            <p>Hello,</p>
            <p><strong>${inviterName}</strong> has invited you to join their legal team for the following case:</p>
            
            <div class="case-info">
                <p><strong>Case Name:</strong> ${caseName}</p>
                <p><strong>Category:</strong> ${caseCategory}</p>
                <p><strong>Lead Attorney:</strong> ${inviterName}</p>
            </div>
            
            <p>As a team member, you'll have access to case documents, communications, and updates. You can collaborate with other team members and the lead attorney throughout the case lifecycle.</p>
            
            <div class="expiry-notice">
                ⏰ <strong>Please respond within 3 days.</strong> This invitation will expire automatically if not accepted.
            </div>
            
            <div class="buttons">
                <a href="${acceptLink}" class="btn btn-accept">Accept Invitation</a>
                <a href="${rejectLink}" class="btn btn-reject">Decline</a>
            </div>
            
            <p style="font-size: 14px; color: #64748b; margin-top: 30px;">
                If you have any questions about this invitation, please contact ${inviterName} directly or reach out to our support team.
            </p>
        </div>
        <div class="footer">
            <p><strong>LawFirmConnect</strong></p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 LawFirmConnect. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = teamInvitationTemplate;
