
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import { BookCategoryModel, BookModel } from '../models/homepage';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

class BookController {
  static readonly defaultImageUrl = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await BookCategoryModel.find();
      if (!categories.length) {
        res.status(404).json({ error: 'No categories found' });
        return;
      }
      res.status(200).json(categories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
  }

  static async getCategoryByNameWithBooks(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      console.log(`Fetching books for category: ${categoryName}`);

      if (!categoryName) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      const category = await BookCategoryModel.findOne({
        name: { $regex: `^${categoryName}$`, $options: 'i' },
      }).populate({
        path: 'books',
        select: 'title price imageUrl bookName subCategory description estimatedDelivery condition author publisher tags quantityNew quantityOld discountNew discountOld seoTitle seoDescription',
      });

      if (!category) {
        res.status(404).json({ error: `Category '${categoryName}' not found` });
        return;
      }

      res.status(200).json({
        categoryName: category.name,
        seoTitle: category.seoTitle || '',
        seoDescription: category.seoDescription || '',
        books: category.books,
      });
    } catch (err: any) {
      console.error('Error fetching category by name:', err);
      res.status(500).json({ error: 'Failed to fetch category data', details: err.message });
    }
  }

  static async getTagsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      console.log(`Fetching tags for category: ${categoryName}`);

      if (!categoryName) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      const category = await BookCategoryModel.findOne({
        name: { $regex: `^${categoryName}$`, $options: 'i' },
      });

      if (!category) {
        res.status(404).json({ error: `Category '${categoryName}' not found` });
        return;
      }

      res.status(200).json({ tags: category.tags || [] });
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
    }
  }

  static async createTag(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      const { tag }: { tag: string } = req.body;

      if (!categoryName || !tag) {
        res.status(400).json({ error: 'Category name and tag are required' });
        return;
      }

      const category = await BookCategoryModel.findOne({
        name: { $regex: `^${categoryName}$`, $options: 'i' },
      });

      if (!category) {
        res.status(404).json({ error: `Category '${categoryName}' not found` });
        return;
      }

      if (category.tags.includes(tag)) {
        res.status(409).json({ error: `Tag '${tag}' already exists in category '${categoryName}'` });
        return;
      }

      category.tags.push(tag);
      await category.save();

      res.status(201).json({ message: `Tag '${tag}' added to category '${categoryName}'`, tags: category.tags });
    } catch (err: any) {
      console.error('Error creating tag:', err);
      res.status(500).json({ error: 'Failed to create tag', details: err.message });
    }
  }

  static async updateTag(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, tagName } = req.params;
      const { newTag }: { newTag: string } = req.body;

      if (!categoryName || !tagName || !newTag) {
        res.status(400).json({ error: 'Category name, tag name, and new tag are required' });
        return;
      }

      const category = await BookCategoryModel.findOne({
        name: { $regex: `^${categoryName}$`, $options: 'i' },
      });

      if (!category) {
        res.status(404).json({ error: `Category '${categoryName}' not found` });
        return;
      }

      if (!category.tags.includes(tagName)) {
        res.status(404).json({ error: `Tag '${tagName}' not found in category '${categoryName}'` });
        return;
      }

      if (category.tags.includes(newTag)) {
        res.status(409).json({ error: `Tag '${newTag}' already exists in category '${categoryName}'` });
        return;
      }

      category.tags = category.tags.map((tag: string) => (tag === tagName ? newTag : tag));
      await category.save();

      res.status(200).json({ message: `Tag '${tagName}' updated to '${newTag}' in category '${categoryName}'`, tags: category.tags });
    } catch (err: any) {
      console.error('Error updating tag:', err);
      res.status(500).json({ error: 'Failed to update tag', details: err.message });
    }
  }

  static async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, tagName } = req.params;

      if (!categoryName || !tagName) {
        res.status(400).json({ error: 'Category name and tag name are required' });
        return;
      }

      const category = await BookCategoryModel.findOne({
        name: { $regex: `^${categoryName}$`, $options: 'i' },
      });

      if (!category) {
        res.status(404).json({ error: `Category '${categoryName}' not found` });
        return;
      }

      if (!category.tags.includes(tagName)) {
        res.status(404).json({ error: `Tag '${tagName}' not found in category '${categoryName}'` });
        return;
      }

      category.tags = category.tags.filter((tag: string) => tag !== tagName);
      await category.save();

      res.status(200).json({ message: `Tag '${tagName}' deleted from category '${categoryName}'`, tags: category.tags });
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      res.status(500).json({ error: 'Failed to delete tag', details: err.message });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoriesData = req.body;

      if (!Array.isArray(categoriesData)) {
        res.status(400).json({ error: 'Input must be an array of category objects' });
        return;
      }

      if (categoriesData.length === 0) {
        res.status(400).json({ error: 'At least one category object is required' });
        return;
      }

      const savedCategories = [];
      const errors = [];

      for (const categoryData of categoriesData) {
        const { name, tags, seoTitle, seoDescription } = categoryData;

        if (!name || !tags || !Array.isArray(tags)) {
          errors.push({ name: name || 'unknown', error: 'Category name and tags array are required' });
          continue;
        }

        const existing = await BookCategoryModel.findOne({ name });
        if (existing) {
          errors.push({ name, error: `Category '${name}' already exists` });
          continue;
        }

        const newCategory = new BookCategoryModel({
          name,
          books: [],
          tags,
          seoTitle: seoTitle || '',
          seoDescription: seoDescription || '',
        });
        const savedCategory = await newCategory.save();
        savedCategories.push(savedCategory);
      }

      if (errors.length > 0 && savedCategories.length === 0) {
        res.status(400).json({ errors });
        return;
      }

      if (errors.length > 0) {
        res.status(207).json({ savedCategories, errors });
        return;
      }

      res.status(201).json(savedCategories);
    } catch (err: any) {
      console.error('Error creating categories:', err);
      res.status(500).json({ error: 'Failed to create categories', details: err.message });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, seoTitle, seoDescription, tags } = req.body;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid category ID format' });
        return;
      }

      const category = await BookCategoryModel.findById(id);
      if (!category) {
        res.status(404).json({ success: false, message: `Route /api/bookstore/book-categories/${id} not found` });
        return;
      }

      category.name = name || category.name;
      category.seoTitle = seoTitle || category.seoTitle;
      category.seoDescription = seoDescription || category.seoDescription;
      category.tags = tags || category.tags;

      const updatedCategory = await category.save();
      res.status(200).json(updatedCategory);
    } catch (err: any) {
      console.error('Error updating category:', err);
      res.status(500).json({ error: 'Failed to update category', details: err.message });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid category ID format' });
        return;
      }

      const category = await BookCategoryModel.findById(id);
      if (!category) {
        res.status(404).json({ success: false, message: `Route /api/bookstore/book-categories/${id} not found` });
        return;
      }

      await BookModel.deleteMany({ categoryName: category.name });
      await category.deleteOne();

      res.status(200).json({ success: true, message: `Category ${category.name} deleted successfully` });
    } catch (err: any) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
  }

  static async createBook(req: Request, res: Response): Promise<void> {
    try {
      const booksData = Array.isArray(req.body) ? req.body : [req.body];

      if (booksData.length === 0) {
        res.status(400).json({ error: 'At least one book object is required' });
        return;
      }

      const savedBooks = [];
      const errors = [];

      for (const book of booksData) {
        const {
          title,
          categoryName,
          subCategory,
          tags,
          price,
          description,
          estimatedDelivery,
          condition,
          author,
          publisher,
          quantityNew,
          quantityOld,
          discountNew,
          discountOld,
          imageUrl,
          seoTitle,
          seoDescription,
        } = book;

        // Validation
        if (
          !title ||
          !categoryName ||
          !subCategory ||
          !tags ||
          !price ||
          !description ||
          !estimatedDelivery ||
          !condition ||
          !author ||
          !publisher ||
          !imageUrl
        ) {
          errors.push({
            title: title || 'unknown',
            error: 'All fields (title, categoryName, subCategory, tags, price, description, estimatedDelivery, condition, author, publisher, imageUrl) are required',
          });
          continue;
        }

        if (!['NEW - ORIGINAL PRICE', 'OLD - 35% OFF', 'BOTH'].includes(condition)) {
          errors.push({
            title,
            error: 'Condition must be "NEW - ORIGINAL PRICE", "OLD - 35% OFF", or "BOTH"',
          });
          continue;
        }

        const tagsArray = typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()) : tags;

        if (!Array.isArray(tagsArray)) {
          errors.push({
            title,
            error: 'Tags must be an array or a comma-separated string',
          });
          continue;
        }

        if (parseFloat(price) <= 0) {
          errors.push({
            title,
            error: 'Price must be greater than 0',
          });
          continue;
        }

        if (imageUrl !== BookController.defaultImageUrl && !imageUrl.startsWith('https://res.cloudinary.com/')) {
          errors.push({
            title,
            error: 'Image URL must be a valid Cloudinary URL or the default image',
          });
          continue;
        }

        if (discountNew !== undefined && (discountNew < 0 || discountNew > 100)) {
          errors.push({
            title,
            error: 'Discount for new books must be between 0 and 100 percent',
          });
          continue;
        }

        if (discountOld !== undefined && (discountOld < 0 || discountOld > 100)) {
          errors.push({
            title,
            error: 'Discount for old books must be between 0 and 100 percent',
          });
          continue;
        }

        // Generate unique book name
        const baseBookName = `${title.replace(/ /g, '-')}-${subCategory.replace(/ /g, '-')}`.toLowerCase();
        let bookName = baseBookName;
        let counter = 1;
        while (await BookModel.findOne({ bookName })) {
          bookName = `${baseBookName}-${counter++}`;
        }

        // Create new book
        const newBook = new BookModel({
          bookName,
          categoryName,
          title,
          price: parseFloat(price),
          imageUrl,
          subCategory,
          description,
          estimatedDelivery,
          tags: tagsArray,
          condition,
          author,
          publisher,
          quantityNew: parseInt(quantityNew) || 0,
          quantityOld: parseInt(quantityOld) || 0,
          discountNew: parseFloat(discountNew) || 0,
          discountOld: parseFloat(discountOld) || 0,
          seoTitle: seoTitle || '',
          seoDescription: seoDescription || '',
        });

        const savedBook = await newBook.save();
        savedBooks.push(savedBook);

        // Update or create category
        const category = await BookCategoryModel.findOne({ name: categoryName });
        if (category) {
          category.books.push(savedBook._id);
          const uniqueTags = tagsArray.filter((tag: string) => !category.tags.includes(tag));
          category.tags.push(...uniqueTags);
          await category.save();
        } else {
          const newCategory = new BookCategoryModel({
            name: categoryName,
            books: [savedBook._id],
            tags: tagsArray,
            seoTitle: seoTitle || '',
            seoDescription: seoDescription || '',
          });
          await newCategory.save();
        }

        // Admin notification
        if (savedBook.quantityNew === 0 && savedBook.quantityOld > 0) {
          console.log(`Admin Notification: New books for '${title}' are out of stock. Suggesting second-hand books.`);
        }
      }

      if (errors.length > 0 && savedBooks.length === 0) {
        res.status(400).json({ errors });
        return;
      }

      if (errors.length > 0) {
        res.status(207).json({ savedBooks, errors });
        return;
      }

      res.status(201).json(savedBooks);
    } catch (err: any) {
      console.error('Error creating books:', err);
      res.status(400).json({ error: 'Failed to create books', details: err.message });
    }
  }

  static async getBookDetailsById(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, bookId } = req.params;
      console.log(`Fetching book details for category: ${categoryName}, bookId: ${bookId}`);

      if (!bookId) {
        res.status(400).json({ error: 'Book ID is required' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({ error: 'Invalid book ID format' });
        return;
      }

      const book = await BookModel.findById(bookId);

      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }

      if (book.categoryName.toLowerCase() !== categoryName.toLowerCase()) {
        res.status(400).json({ error: 'Book does not belong to the specified category' });
        return;
      }

      res.status(200).json(book);
    } catch (err: any) {
      console.error('Error fetching book details:', err);
      if (err.name === 'CastError') {
        res.status(400).json({ error: 'Invalid book ID format' });
        return;
      }
      res.status(500).json({ error: 'Failed to fetch book details', details: err.message });
    }
  }

  static async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, bookId } = req.params;
      const {
        title,
        categoryName: newCategoryName,
        subCategory,
        tags,
        price,
        description,
        estimatedDelivery,
        condition,
        author,
        publisher,
        quantityNew,
        quantityOld,
        discountNew,
        discountOld,
        imageUrl,
        seoTitle,
        seoDescription,
      } = req.body;
      console.log(`Updating book for category: ${categoryName}, bookId: ${bookId}`);

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({ error: 'Invalid book ID format' });
        return;
      }

      const book = await BookModel.findById(bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }

      if (book.categoryName.toLowerCase() !== categoryName.toLowerCase()) {
        res.status(400).json({ error: 'Book does not belong to the specified category' });
        return;
      }

      // Update fields with proper fallbacks
      const updatedTitle = title !== undefined ? title : book.title;
      const updatedCategoryName = newCategoryName !== undefined ? newCategoryName : book.categoryName;
      const updatedSubCategory = subCategory !== undefined ? subCategory : book.subCategory;
      const updatedPrice = price !== undefined ? parseFloat(price) : book.price;
      const updatedDescription = description !== undefined ? description : book.description;
      const updatedEstimatedDelivery = estimatedDelivery !== undefined ? estimatedDelivery : book.estimatedDelivery;
      const updatedTags = tags !== undefined ? (typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim()) : tags) : book.tags;
      const updatedCondition = condition !== undefined ? condition : book.condition;
      const updatedAuthor = author !== undefined ? author : book.author;
      const updatedPublisher = publisher !== undefined ? publisher : book.publisher;
      const updatedQuantityNew = quantityNew !== undefined ? parseInt(quantityNew) || 0 : book.quantityNew;
      const updatedQuantityOld = quantityOld !== undefined ? parseInt(quantityOld) || 0 : book.quantityOld;
      const updatedDiscountNew = discountNew !== undefined ? parseFloat(discountNew) || 0 : book.discountNew;
      const updatedDiscountOld = discountOld !== undefined ? parseFloat(discountOld) || 0 : book.discountOld;
      const updatedImageUrl = imageUrl !== undefined ? imageUrl : book.imageUrl;

      // Validation
      if (
        !updatedTitle ||
        !updatedCategoryName ||
        !updatedSubCategory ||
        !updatedTags ||
        updatedPrice <= 0 ||
        !updatedDescription ||
        !updatedEstimatedDelivery ||
        !updatedCondition ||
        !updatedAuthor ||
        !updatedPublisher ||
        !updatedImageUrl
      ) {
        res.status(400).json({ error: 'All required fields must have valid values' });
        return;
      }

      if (!['NEW - ORIGINAL PRICE', 'OLD - 35% OFF', 'BOTH'].includes(updatedCondition)) {
        res.status(400).json({ error: 'Condition must be "NEW - ORIGINAL PRICE", "OLD - 35% OFF", or "BOTH"' });
        return;
      }

      if (!Array.isArray(updatedTags)) {
        res.status(400).json({ error: 'Tags must be an array or a comma-separated string' });
        return;
      }

      if (updatedImageUrl !== BookController.defaultImageUrl && !updatedImageUrl.startsWith('https://res.cloudinary.com/')) {
        res.status(400).json({ error: 'Image URL must be a valid Cloudinary URL or the default image' });
        return;
      }

      if (updatedDiscountNew < 0 || updatedDiscountNew > 100) {
        res.status(400).json({ error: 'Discount for new books must be between 0 and 100 percent' });
        return;
      }

      if (updatedDiscountOld < 0 || updatedDiscountOld > 100) {
        res.status(400).json({ error: 'Discount for old books must be between 0 and 100 percent' });
        return;
      }

      // Generate unique book name
      const baseBookName = `${updatedTitle.replace(/ /g, '-')}-${updatedSubCategory.replace(/ /g, '-')}`.toLowerCase();
      let bookName = baseBookName;
      let counter = 1;
      while (await BookModel.findOne({ bookName, _id: { $ne: bookId } })) {
        bookName = `${baseBookName}-${counter++}`;
      }

      // Update book
      book.bookName = bookName;
      book.categoryName = updatedCategoryName;
      book.title = updatedTitle;
      book.price = updatedPrice;
      book.imageUrl = updatedImageUrl;
      book.subCategory = updatedSubCategory;
      book.description = updatedDescription;
      book.estimatedDelivery = updatedEstimatedDelivery;
      book.tags = updatedTags;
      book.condition = updatedCondition;
      book.author = updatedAuthor;
      book.publisher = updatedPublisher;
      book.quantityNew = updatedQuantityNew;
      book.quantityOld = updatedQuantityOld;
      book.discountNew = updatedDiscountNew;
      book.discountOld = updatedDiscountOld;
      book.seoTitle = seoTitle || book.seoTitle;
      book.seoDescription = seoDescription || book.seoDescription;

      const updatedBook = await book.save();

      // Update category
      const category = await BookCategoryModel.findOne({ name: updatedCategoryName });
      if (category) {
        const uniqueTags = updatedTags.filter((tag: string) => !category.tags.includes(tag));
        category.tags.push(...uniqueTags);
        await category.save();
      } else if (updatedCategoryName !== categoryName) {
        const newCategory = new BookCategoryModel({
          name: updatedCategoryName,
          books: [book._id],
          tags: updatedTags,
          seoTitle: seoTitle || '',
          seoDescription: seoDescription || '',
        });
        await newCategory.save();
      }

      // Admin notification
      if (updatedBook.quantityNew === 0 && updatedBook.quantityOld > 0) {
        console.log(`Admin Notification: New books for '${updatedTitle}' are out of stock. Suggesting second-hand books.`);
      }

      res.status(200).json(updatedBook);
    } catch (err: any) {
      console.error('Error updating book:', err);
      if (err.name === 'CastError') {
        res.status(400).json({ error: 'Invalid book ID format' });
        return;
      }
      res.status(400).json({ error: 'Failed to update book', details: err.message });
    }
  }

  static async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, bookId } = req.params;
      console.log(`Deleting book for category: ${categoryName}, bookId: ${bookId}`);

      if (!categoryName || !bookId) {
        res.status(400).json({ error: 'Category name and book ID are required' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({ error: 'Invalid book ID format' });
        return;
      }

      const category = await BookCategoryModel.findOne({
        name: { $regex: `^${categoryName}$`, $options: 'i' },
      });

      if (!category) {
        res.status(404).json({ error: `Category '${categoryName}' not found` });
        return;
      }

      const book = await BookModel.findByIdAndDelete(bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found in BookModel' });
        return;
      }

      const bookIndex = category.books.findIndex((bookRef: mongoose.Types.ObjectId) => bookRef.toString() === bookId);
      if (bookIndex !== -1) {
        category.books.splice(bookIndex, 1);
        await category.save();
      }

      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting book:', err);
      if (err.name === 'CastError') {
        res.status(400).json({ error: 'Invalid book ID format' });
        return;
      }
      res.status(400).json({ error: 'Failed to delete book', details: err.message });
    }
  }

  static async deleteAllCategories(req: Request, res: Response): Promise<void> {
    try {
      await BookCategoryModel.deleteMany({});
      await BookModel.deleteMany({});
      res.status(200).json({ message: 'All book categories and books deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting categories:', err);
      res.status(500).json({ error: 'Failed to delete categories', details: err.message });
    }
  }

  static async deleteAllBooks(req: Request, res: Response): Promise<void> {
    try {
      await BookModel.deleteMany({});
      await BookCategoryModel.updateMany({}, { $set: { books: [] } });
      res.status(200).json({ message: 'All books deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting books:', err);
      res.status(500).json({ error: 'Failed to delete books', details: err.message });
    }
  }
}

export default BookController;
