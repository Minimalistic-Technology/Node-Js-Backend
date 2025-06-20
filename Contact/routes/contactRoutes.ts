import express, { Router, Request, Response } from 'express';
import sendEmail from '../utils/sendMail';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response): Promise<void> => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  try {
    await sendEmail({
      email,
      subject: "New Contact Message",
      template: "contact.ejs", // make sure this template exists in /mails
      data: { name, email, message }
    });

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
