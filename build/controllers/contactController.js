"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContact = exports.getContacts = exports.submitContactForm = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const submitContactForm = async (req, res) => {
    try {
        const contact = new Contact_1.default(req.body);
        await contact.save();
        res.status(201).json(contact);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to submit contact form' });
    }
};
exports.submitContactForm = submitContactForm;
const getContacts = async (req, res) => {
    try {
        const { email } = req.query;
        const contacts = typeof email === 'string'
            ? await Contact_1.default.find({ email })
            : await Contact_1.default.find();
        res.json(contacts);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
};
exports.getContacts = getContacts;
const updateContact = async (req, res) => {
    try {
        const contact = await Contact_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!contact) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json(contact);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update contact' });
    }
};
exports.updateContact = updateContact;
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact_1.default.findByIdAndDelete(req.params.id);
        if (!contact) {
            res.status(404).json({ error: 'Contact not found' });
            return;
        }
        res.json({ message: 'Contact deleted successfully' });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete contact' });
    }
};
exports.deleteContact = deleteContact;
