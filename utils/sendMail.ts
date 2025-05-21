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

  // Debug: log received email
  console.log("sendMail received email:", email);

  // Validate recipient email
  if (!email || typeof email !== 'string' || email.trim() === '') {
    console.error("❌ No valid recipient email provided!");
    throw new Error("No recipients defined");
  }

  // Debug: log environment variables used for SMTP (hide password!)
  console.log({
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    EMAIL_USER: process.env.EMAIL_USER,
    SMTP_MAIL: process.env.SMTP_MAIL,
  });

  // Create transporter
  const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '465', 10),
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Resolve template path (adjust if your directory structure differs)
  const templatePath = path.join(__dirname, '../mails', template);

  // Render email HTML using EJS template and data
  const html: string = await ejs.renderFile(templatePath, data);

  // Compose email options
  const mailOptions = {
    from: process.env.SMTP_MAIL || process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  };

  // Debug: log mail options (avoid logging sensitive data)
  console.log("📤 Sending email with options:", {
    from: mailOptions.from,
    to: mailOptions.to,
    subject: mailOptions.subject,
  });

  // Send email
  await transporter.sendMail(mailOptions);

  console.log("✅ Email sent successfully to", email);
};

export default sendMail;
