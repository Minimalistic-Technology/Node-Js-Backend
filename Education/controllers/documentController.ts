import { Request, Response } from 'express';
import Document, { IDocument } from '../models/document';


export const getAllDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents', error });
  }
};


export const getDocumentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document', error });
  }
};

export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, documentType, fileUrl, fileFormat } = req.body;

    if (!studentId || !documentType || !fileUrl || !fileFormat) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const newDocument: IDocument = new Document({
      studentId,
      documentType,
      fileUrl,
      fileFormat,
    });

    await newDocument.save();
    res.status(201).json({ message: 'Document created successfully', document: newDocument });
  } catch (error) {
    res.status(500).json({ message: 'Error creating document', error });
  }
};


export const updateDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, documentType, fileUrl, fileFormat } = req.body;

    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      { studentId, documentType, fileUrl, fileFormat },
      { new: true, runValidators: true }
    );

    if (!updatedDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    res.status(200).json({ message: 'Document updated successfully', document: updatedDocument });
  } catch (error) {
    res.status(500).json({ message: 'Error updating document', error });
  }
};


export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedDocument = await Document.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document', error });
  }
};