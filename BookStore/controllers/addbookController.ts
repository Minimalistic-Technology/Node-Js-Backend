import { Request, Response } from 'express';
import BookRequest from '../models/addbook';

export default class BookRequestController {
  static async createBookRequest(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, mobile, bookTitle, publisher, author, classLevel, message } = req.body;
      const newRequest = new BookRequest({ name, email, mobile, bookTitle, publisher, author, classLevel, message });
      await newRequest.save();
      res.status(201).json({ message: 'Book request submitted successfully', request: newRequest });
    } catch (err) {
      console.error('Error creating book request:', err);
      res.status(500).json({ error: 'An unexpected error occurred while submitting book request' });
    }
  }

  static async getBookRequests(req: Request, res: Response): Promise<void> {
    try {
      const requests = await BookRequest.find();
      if (!requests.length) {
        res.status(404).json({ error: 'No book requests found' });
        return;
      }
      res.status(200).json(requests);
    } catch (err) {
      console.error('Error fetching book requests:', err);
      res.status(500).json({ error: 'An unexpected error occurred while fetching book requests' });
    }
  }
}