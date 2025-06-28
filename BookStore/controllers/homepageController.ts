import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { CategoryModel, BookModel } from '../models/homepage';

class BookController {
  // ✅ GET all categories
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.find();
      if (!categories.length) {
        res.status(404).json({ error: 'No categories found' });
        return;
      }
      res.status(200).json(categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'An unexpected error occurred while fetching categories' });
    }
  }

  // ✅ GET category by name with books
  static async getCategoryByNameWithBooks(req: Request, res: Response): Promise<void> {
  try {
    const { categoryName } = req.params;

    if (!categoryName) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const category = await CategoryModel.findOne({
      name: { $regex: `^${categoryName}$`, $options: 'i' }
    }).populate({
      path: 'books',
      select: 'title price imageUrl bookName viewCount subCategory'
    });

    if (!category) {
      res.status(404).json({ error: 'Category not found for the specified name' });
      return;
    }

    res.status(200).json({
      categoryName: category.name,
      books: category.books
    });
  } catch (err: any) {
    console.error('Error fetching category by name:', err);
    res.status(500).json({ error: 'An unexpected error occurred while fetching category data' });
  }
}


  // ✅ POST a new category
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      const existing = await CategoryModel.findOne({ name });
      if (existing) {
        res.status(409).json({ error: `Category '${name}' already exists` });
        return;
      }

      const newCategory = new CategoryModel({ name, books: [] });
      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (err) {
      console.error('Error creating category:', err);
      res.status(500).json({ error: 'An unexpected error occurred while creating the category' });
    }
  }

  // ✅ POST books (with category linkage)
  static async createBook(req: Request, res: Response): Promise<void> {
    try {
      const booksData = req.body;

      if (!Array.isArray(booksData)) {
        res.status(400).json({ error: 'Input must be an array of book objects' });
        return;
      }

      if (booksData.length === 0) {
        res.status(400).json({ error: 'At least one book object is required' });
        return;
      }

      const savedBooks = [];

      for (const book of booksData) {
        const { title, price, imageUrl, subCategory, description, viewCount, estimatedDelivery, tags, condition, author, publisher, isbn } = book;

        if (!title || !price || !imageUrl || !subCategory || !description || viewCount === undefined || !estimatedDelivery || !tags || !condition  ) {
          res.status(400).json({
            error: 'All fields (title, price, imageUrl, subCategory, description, viewCount, estimatedDelivery, tags, condition, productCategory, author, publisher, isbn) are required for each book'
          });
          return;
        }

        if (condition !== 'NEW - ORIGINAL PRICE' && condition !== 'OLD - 35% OFF') {
          res.status(400).json({ error: 'Condition must be "NEW - ORIGINAL PRICE" or "OLD - 35% OFF" for each book' });
          return;
        }

        if (!Array.isArray(tags)) {
          res.status(400).json({ error: 'Tags must be an array for each book' });
          return;
        }

        if (typeof viewCount !== 'number' || viewCount < 0) {
          res.status(400).json({ error: 'viewCount must be a non-negative number for each book' });
          return;
        }

        // Generate a unique bookName based on title and subCategory
        const baseBookName = `${title.replace(/ /g, '-')}-${subCategory.replace(/ /g, '-')}`.toLowerCase();
        let bookName = baseBookName;
        let counter = 1;
        while (await BookModel.findOne({ bookName })) {
          bookName = `${baseBookName}-${counter++}`;
        }

        const newBook = new BookModel({
          bookName,
          categoryName: req.params.categoryName,
          title,
          price,
          imageUrl,
          subCategory,
          description,
          viewCount,
          estimatedDelivery,
          tags,
          condition,
          author,
          publisher,
          isbn,
          
        });

        const savedBook = await newBook.save();
        savedBooks.push(savedBook);

        // Link to category
        const category = await CategoryModel.findOne({ name: req.params.categoryName });
        if (category) {
          category.books.push(savedBook._id);
          await category.save();
        }
      }

      res.status(201).json(savedBooks);
    } catch (err) {
      console.error('Error creating books:', err);
      res.status(500).json({ error: 'An unexpected error occurred while creating books' });
    }
  }

  // ✅ GET book details by bookName
  static async getBookDetailsById(req: Request, res: Response): Promise<void> {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      res.status(400).json({ error: 'Book ID is required' });
      return;
    }

    const book = await BookModel.findById(bookId);

    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }

    res.status(200).json(book);
  } catch (err:any) {
    console.error('Error fetching book details:', err);
    
    // If invalid ID format, return 400
    if (err.name === 'CastError') {
      res.status(400).json({ error: 'Invalid book ID format' });
      return;
    }

    res.status(500).json({ error: 'An unexpected error occurred while fetching book details' });
  }
}


  // ✅ DELETE all categories
  static async deleteAllCategories(req: Request, res: Response): Promise<void> {
    try {
      await CategoryModel.deleteMany({});
      res.status(200).json({ message: 'All categories deleted successfully' });
    } catch (err) {
      console.error('Error deleting categories:', err);
      res.status(500).json({ error: 'An unexpected error occurred while deleting categories' });
    }
  }

  // ✅ DELETE all books
  static async deleteAllBooks(req: Request, res: Response): Promise<void> {
    try {
      await BookModel.deleteMany({});
      await CategoryModel.updateMany({}, { $set: { books: [] } });
      res.status(200).json({ message: 'All books deleted successfully' });
    } catch (err) {
      console.error('Error deleting books:', err);
      res.status(500).json({ error: 'An unexpected error occurred while deleting books' });
    }
  }
}




export default BookController;