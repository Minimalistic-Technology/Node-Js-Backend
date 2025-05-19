import express, { Router, Request, Response } from 'express';
import sendEmail from '../utils/sendMail';

const router: Router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
   await sendEmail({name, email, message});
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email" });
  }
});

export default router;
