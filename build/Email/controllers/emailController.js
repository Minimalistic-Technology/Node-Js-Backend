"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactDetails = exports.submitContactForm = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const email_1 = require("../models/email");
dotenv_1.default.config();
// Set up the email transporter
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Submit contact form and send email
const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        // Validate required fields
        if (!name || !email || !phone || !message) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        // Save contact to database
        const newContact = new email_1.Contact({ name, email, phone, message });
        await newContact.save();
        // Email configuration
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
        // Send email
        await transporter.sendMail(mailOptions);
        res.status(201).json({ message: 'Contact form submitted successfully, and email sent' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.submitContactForm = submitContactForm;
// Return static contact info
const getContactDetails = (_req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.getContactDetails = getContactDetails;
