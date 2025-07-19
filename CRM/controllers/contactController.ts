import { Request, Response } from 'express';
import { ContactModel } from '../models/Registercontact';

export const createContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = new ContactModel(req.body);
    const saved = await contact.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: 'Error creating contact' });
  }
};

export const getContacts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const contacts = await ContactModel.find();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contacts' });
  }
};

export const getContactById = async (req: Request, res: Response): Promise<void> => {
  try {
    const contact = await ContactModel.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ error: 'Contact not found' });
      return;
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching contact' });
  }
}; 

export const updateContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await ContactModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Contact not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Error updating contact' });
  }
};

export const deleteContact = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ContactModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
       res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting contact' });
  }
};
