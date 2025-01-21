const nodemailer = require('nodemailer')
const generateEmailContent = require('./generateEmailContent');

const emailSender = async(results, resultsHtml, searchQuery) => {
   
    const { emailSubject, htmlBody } = generateEmailContent(searchQuery, resultsHtml);
    // Send results via email using Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAILCRED, // Replace with your Gmail address
            pass: process.env.GMAIL_APP_PASSKEY, // Replace with your app-specific password
        },
    });

    const mailOptions = {
        from: process.env.SENDER_EMAILCRED, // Sender address
        to: 'mashoodahmedkhan8824@gmail.com', // Recipient address
        subject: emailSubject,
        html: htmlBody,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}

module.exports = emailSender;