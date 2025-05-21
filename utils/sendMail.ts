require('dotenv').config();
import nodemailer, { Transporter } from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

interface EmailOptions {
  email: string;
  subject: string;
  template: string;
  data: { [key: string]: any };
}

const sendMail = async (options: EmailOptions): Promise<void> => {
  const { email, subject, template, data } = options;

  // Debug log to check what email is received
  console.log("sendMail received email:", email);

  // Safety check to prevent "No recipients defined" error
  if (!email || typeof email !== 'string' || email.trim() === '') {
    console.error("❌ No valid recipient email provided!");
    throw new Error("No recipients defined");
  }

  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Path to EJS template
  const templatePath = path.join(__dirname, '../mails', template);

  // Render the email HTML using EJS
  const html: string = await ejs.renderFile(templatePath, data);

  // Compose mail options
  const mailOptions = {
    from: process.env.SMTP_MAIL || process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  console.log("📤 Sending email with options:", mailOptions);

  // Send the email
  await transporter.sendMail(mailOptions);

  console.log("✅ Email sent successfully to", email);
};

export default sendMail;
