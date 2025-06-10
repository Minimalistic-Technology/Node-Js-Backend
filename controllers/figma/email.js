// controllers/contactController.js
const Contact = require('../../models/figma/email');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit contact form and send email
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new contact entry
    const newContact = new Contact({
      name,
      email,
      phone,
      message,
    });

    await newContact.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: 'New Contact Form Submission',
      text: `
        New contact form submission received:
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'Contact form submitted successfully, and email sent' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get contact details (email, location, opening hours)
exports.getContactDetails = (req, res) => {
  try {
    const contactDetails = {
      email: 'siddhiestate23@gmail.com',
      location: 'Mumbai MH IN',
      openingHours: {
        Monday: '9:00am - 10:00pm',
        Tuesday: '9:00am - 10:00pm',
        Wednesday: '9:00am - 10:00pm',
        Thursday: '9:00am - 10:00pm',
        Friday: '9:00am - 10:00pm',
        Saturday: '9:00am - 6:00pm',
        Sunday: '9:00am - 12:00pm',
      },
    };
    res.status(200).json(contactDetails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};