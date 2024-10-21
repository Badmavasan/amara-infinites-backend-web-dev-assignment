const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = (userEmail, token) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Verify your email',
        text: `Click this link to verify your email: ${process.env.HOST}/auth/verify/${token}`
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email', err);
        } else {
            console.log('Verification email sent: ', info.response);
        }
    });
};

module.exports = sendVerificationEmail;
