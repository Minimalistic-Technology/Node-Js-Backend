"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDocument = exports.updateDocument = exports.createDocument = exports.getDocumentById = exports.getAllDocuments = void 0;
const document_1 = __importDefault(require("../models/document"));
// Get all documents
const getAllDocuments = async (req, res) => {
    try {
        const documents = await document_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(documents);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching documents', error });
    }
};
exports.getAllDocuments = getAllDocuments;
// Get document by ID
const getDocumentById = async (req, res) => {
    try {
        const document = await document_1.default.findById(req.params.id);
        if (!document) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }
        res.status(200).json(document);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching document', error });
    }
};
exports.getDocumentById = getDocumentById;
// Create a new document
const createDocument = async (req, res) => {
    try {
        const { studentId, documentType, fileUrl, fileFormat } = req.body;
        // Validate required fields
        if (!studentId || !documentType || !fileUrl || !fileFormat) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const newDocument = new document_1.default({
            studentId,
            documentType,
            fileUrl,
            fileFormat,
        });
        await newDocument.save();
        res.status(201).json({ message: 'Document created successfully', document: newDocument });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating document', error });
    }
};
exports.createDocument = createDocument;
// Update a document by ID
const updateDocument = async (req, res) => {
    try {
        const { studentId, documentType, fileUrl, fileFormat } = req.body;
        const updatedDocument = await document_1.default.findByIdAndUpdate(req.params.id, { studentId, documentType, fileUrl, fileFormat }, { new: true, runValidators: true });
        if (!updatedDocument) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }
        res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating document', error });
    }
};
exports.updateDocument = updateDocument;
// Delete a document by ID
const deleteDocument = async (req, res) => {
    try {
        const deletedDocument = await document_1.default.findByIdAndDelete(req.params.id);
        if (!deletedDocument) {
            res.status(404).json({ message: 'Document not found' });
            return;
        }
        res.status(200).json({ message: 'Document deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting document', error });
    }
};
exports.deleteDocument = deleteDocument;
