import { Request, Response } from 'express';
import Contact, { IContact } from '../models/Contact';

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = new Contact(req.body as IContact);
    await contact.save();
    res.status(201).json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Failed to submit contact form' });
  }
};

export const getContacts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.query;
    const contacts = typeof email === 'string'
      ? await Contact.find({ email })
      : await Contact.find();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json(contact);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update contact' });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete contact' });
  }
};
