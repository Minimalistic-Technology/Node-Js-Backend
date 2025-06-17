import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {Contact} from '../../models/figma/email';

dotenv.config();

// Set up the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Submit contact form and send email
export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, message } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // Save contact to database
    const newContact = new Contact({ name, email, phone, message });
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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Return static contact info
export const getContactDetails = (_req: Request, res: Response): void => {
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
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
