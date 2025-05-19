const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (name, email, message, subject = "Your OTP Code") => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"MinimalisticLearning" <${process.env.EMAIL_USER}>`,
            to: email,
            subject,
            html: `
                <p>Dear ${name},</p>
                <p>Your One-Time Password (OTP) for logging into <strong>MinimalisticLearning</strong> is:</p>
                <h2>🔐 OTP: <strong>${message}</strong></h2>
                <p>Please enter this code within the next <strong>5 minutes</strong> to complete your login. Do not share this code with anyone for security reasons.</p>
                <p>If you did not request this login, please ignore this message or contact us immediately.</p>
                <br/>
                <p>Thank you,<br/>
                MinimalisticLearning Team<br/>
                <a href="mailto:hi@minimalisticTechnology.com">hi@minimalisticTechnology.com</a></p>
            `
        });

    } catch (err) {
        console.error("Error sending email:", err);
        throw err;
    }
};

module.exports = sendEmail;
