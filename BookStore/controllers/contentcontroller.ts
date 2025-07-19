import { Request, Response } from 'express';
import { Book } from '../models/content';
import axios from 'axios';

interface Category {
    _id: string;
    name: string;
}

export class BookController {
    // Get all books
    static async getAllBooks(req: Request, res: Response): Promise<void> {
        try {
            const books = await Book.find();
            res.json(books);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Get single book
    static async getBookById(req: Request, res: Response): Promise<void> {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }
            res.json(book);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    // Get all categories
    static async getCategories(req: Request, res: Response): Promise<void> {
        try {
            const response = await axios.get('http://localhost:5000/api/bookstore/categories');
            res.json(response.data);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch categories', error: (error as Error).message });
        }
    }

    // Create book (for /api/books and /api/bookstore/content)
    static async createBook(req: Request, res: Response): Promise<void> {
        try {
            const bookData = {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                tags: req.body.tags ? req.body.tags.split(',') : [],
                seoTitle: req.body.seoTitle,
                seoDescription: req.body.seoDescription
            };

            const book = new Book(bookData);
            const newBook = await book.save();
            res.status(201).json(newBook);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    // Update book
    static async updateBook(req: Request, res: Response): Promise<void> {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }

            book.title = req.body.title || book.title;
            book.content = req.body.content || book.content;
            book.category = req.body.category || book.category;
            book.tags = req.body.tags ? req.body.tags.split(',') : book.tags;
            book.seoTitle = req.body.seoTitle || book.seoTitle;
            book.seoDescription = req.body.seoDescription || book.seoDescription;

            const updatedBook = await book.save();
            res.json(updatedBook);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    // Delete book
    static async deleteBook(req: Request, res: Response): Promise<void> {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }
            
            await book.deleteOne();
            res.json({ message: 'Book deleted' });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}