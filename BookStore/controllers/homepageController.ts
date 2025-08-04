import { Request, Response } from "express";
import { BookModel, BookCategoryModel, IBook, IBookCategory } from "../models/homepage";

class BookController {
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await BookCategoryModel.find().lean();
      res.status(200).json(categories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      console.log('Request body:', req.body); // Debugging log
      const { name, tags, subCategories, seoTitle, seoDescription } = req.body;

      // Validate required name field
      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      // Format name to replace spaces with hyphens
      const formattedName = name.trim().replace(/\s+/g, '-');

      // Check if category with the same name already exists
      const existingCategory = await BookCategoryModel.findOne({ name: formattedName });
      if (existingCategory) {
        res.status(400).json({ error: 'Category name already exists' });
        return;
      }

      const category = new BookCategoryModel({
        name: formattedName,
        tags: tags ? tags.map((tag: string) => tag.trim().replace(/\s+/g, '-')) : [],
        subCategories: subCategories
          ? subCategories.map((sub: any) => ({
              name: sub.name.trim().replace(/\s+/g, '-'),
              subSubCategories: sub.subSubCategories
                ? sub.subSubCategories.map((subSub: string) => subSub.trim().replace(/\s+/g, '-'))
                : [],
              books: [],
            }))
          : [],
        seoTitle,
        seoDescription,
      });
      await category.save();
      res.status(201).json(category);
    } catch (err: any) {
      console.error('Error creating category:', err);
      res.status(400).json({ error: 'Failed to create category', details: err.message });
    }
  }

  static async createBulkCategories(req: Request, res: Response): Promise<void> {
    try {
      console.log('Bulk request body:', req.body); // Debugging log
      const categories = req.body;

      if (!Array.isArray(categories) || categories.length === 0) {
        res.status(400).json({ error: 'Request body must be a non-empty array of categories' });
        return;
      }

      const createdCategories = [];
      const errors = [];

      for (const cat of categories) {
        const { name, tags, subCategories, seoTitle, seoDescription } = cat;

        if (!name || !name.trim()) {
          errors.push({ name: name || 'undefined', error: 'Category name is required' });
          continue;
        }

        const formattedName = name.trim().replace(/\s+/g, '-');
        const existingCategory = await BookCategoryModel.findOne({ name: formattedName });
        if (existingCategory) {
          errors.push({ name: formattedName, error: 'Category name already exists' });
          continue;
        }

        const category = new BookCategoryModel({
          name: formattedName,
          tags: tags ? tags.map((tag: string) => tag.trim().replace(/\s+/g, '-')) : [],
          subCategories: subCategories
            ? subCategories.map((sub: any) => ({
                name: sub.name.trim().replace(/\s+/g, '-'),
                subSubCategories: sub.subSubCategories
                  ? sub.subSubCategories.map((subSub: string) => subSub.trim().replace(/\s+/g, '-'))
                  : [],
                books: [],
              }))
            : [],
          seoTitle,
          seoDescription,
        });

        try {
          await category.save();
          createdCategories.push(category);
        } catch (err: any) {
          errors.push({ name: formattedName, error: err.message });
        }
      }

      if (errors.length > 0 && createdCategories.length === 0) {
        res.status(400).json({ error: 'Failed to create any categories', details: errors });
        return;
      }

      res.status(201).json({
        message: `Successfully created ${createdCategories.length} categories`,
        created: createdCategories,
        errors: errors.length > 0 ? errors : undefined,
      });
    } catch (err: any) {
      console.error('Error creating bulk categories:', err);
      res.status(500).json({ error: 'Failed to create bulk categories', details: err.message });
    }
  }

  static async getCategoryByNameWithBooks(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategory, subSubCategory } = req.params;
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) }).lean();
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      let booksQuery: any = { categoryName: decodeURIComponent(categoryName) };
      if (subCategory) {
        booksQuery.subCategory = decodeURIComponent(subCategory);
      }
      if (subSubCategory) {
        booksQuery.subSubCategory = decodeURIComponent(subSubCategory);
      }

      const books = await BookModel.find(booksQuery).lean();
      res.status(200).json({ ...category, books });
    } catch (err: any) {
      console.error('Error fetching category with books:', err);
      res.status(500).json({ error: 'Failed to fetch category with books', details: err.message });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, tags, subCategories, seoTitle, seoDescription } = req.body;

      // Validate name if provided
      if (name && !name.trim()) {
        res.status(400).json({ error: 'Category name cannot be empty' });
        return;
      }

      const updateData: any = {
        tags: tags ? tags.map((tag: string) => tag.trim().replace(/\s+/g, '-')) : [],
        subCategories: subCategories
          ? subCategories.map((sub: any) => ({
              name: sub.name.trim().replace(/\s+/g, '-'),
              subSubCategories: sub.subSubCategories
                ? sub.subSubCategories.map((subSub: string) => subSub.trim().replace(/\s+/g, '-'))
                : [],
              books: sub.books || [],
            }))
          : [],
        seoTitle,
        seoDescription,
      };

      if (name) {
        updateData.name = name.trim().replace(/\s+/g, '-');
        const existingCategory = await BookCategoryModel.findOne({ name: updateData.name });
        if (existingCategory && existingCategory._id.toString() !== id) {
          res.status(400).json({ error: 'Category name already exists' });
          return;
        }
      }

      const category = await BookCategoryModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.status(200).json(category);
    } catch (err: any) {
      console.error('Error updating category:', err);
      res.status(400).json({ error: 'Failed to update category', details: err.message });
    }
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await BookCategoryModel.findByIdAndDelete(id);
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      await BookModel.deleteMany({ categoryName: category.name });
      res.status(200).json({ message: 'Category and associated books deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
  }

  static async createSubCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      const { name, subSubCategories } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Subcategory name is required' });
        return;
      }

      const formattedName = name.trim().replace(/\s+/g, '-');
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      if (category.subCategories.some((sub: any) => sub.name === formattedName)) {
        res.status(400).json({ error: 'Subcategory already exists' });
        return;
      }
      category.subCategories.push({
        name: formattedName,
        subSubCategories: subSubCategories
          ? subSubCategories.map((subSub: string) => subSub.trim().replace(/\s+/g, '-'))
          : [],
        books: [],
      });
      await category.save();
      res.status(201).json(category);
    } catch (err: any) {
      console.error('Error creating subcategory:', err);
      res.status(400).json({ error: 'Failed to create subcategory', details: err.message });
    }
  }

  static async deleteSubCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategoryName } = req.params;
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCategory = category.subCategories.find((sub: any) => sub.name === decodeURIComponent(subCategoryName));
      if (!subCategory) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      category.subCategories = category.subCategories.filter(
        (sub: any) => sub.name !== decodeURIComponent(subCategoryName)
      );
      await category.save();
      await BookModel.deleteMany({
        categoryName: decodeURIComponent(categoryName),
        subCategory: decodeURIComponent(subCategoryName),
      });
      res.status(200).json(category);
    } catch (err: any) {
      console.error('Error deleting subcategory:', err);
      res.status(500).json({ error: 'Failed to delete subcategory', details: err.message });
    }
  }

  static async createSubSubCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategory } = req.params;
      const { name } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Sub-subcategory name is required' });
        return;
      }

      const formattedName = name.trim().replace(/\s+/g, '-');
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCat = category.subCategories.find((sub: any) => sub.name === decodeURIComponent(subCategory));
      if (!subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      if (subCat.subSubCategories.includes(formattedName)) {
        res.status(400).json({ error: 'Sub-subcategory already exists' });
        return;
      }
      subCat.subSubCategories.push(formattedName);
      await category.save();
      res.status(201).json(category);
    } catch (err: any) {
      console.error('Error creating sub-subcategory:', err);
      res.status(400).json({ error: 'Failed to create sub-subcategory', details: err.message });
    }
  }

  static async deleteSubSubCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategory, subSubCategoryName } = req.params;
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCat = category.subCategories.find((sub: any) => sub.name === decodeURIComponent(subCategory));
      if (!subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      if (!subCat.subSubCategories.includes(decodeURIComponent(subSubCategoryName))) {
        res.status(404).json({ error: 'Sub-subcategory not found' });
        return;
      }
      subCat.subSubCategories = subCat.subSubCategories.filter(
        (subSub: any) => subSub !== decodeURIComponent(subSubCategoryName)
      );
      await category.save();
      await BookModel.deleteMany({
        categoryName: decodeURIComponent(categoryName),
        subCategory: decodeURIComponent(subCategory),
        subSubCategory: decodeURIComponent(subSubCategoryName),
      });
      res.status(200).json(category);
    } catch (err: any) {
      console.error('Error deleting sub-subcategory:', err);
      res.status(500).json({ error: 'Failed to delete sub-subcategory', details: err.message });
    }
  }

  static async getTagsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      res.status(200).json({ tags: category.tags });
    } catch (err: any) {
      console.error('Error fetching tags:', err);
      res.status(500).json({ error: 'Failed to fetch tags', details: err.message });
    }
  }

  static async createTag(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      const { tag } = req.body;
      if (!tag || !tag.trim()) {
        res.status(400).json({ error: 'Tag is required' });
        return;
      }
      const formattedTag = tag.trim().replace(/\s+/g, '-');
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      if (category.tags.includes(formattedTag)) {
        res.status(400).json({ error: 'Tag already exists' });
        return;
      }
      category.tags.push(formattedTag);
      await category.save();
      res.status(201).json({ tags: category.tags });
    } catch (err: any) {
      console.error('Error creating tag:', err);
      res.status(400).json({ error: 'Failed to create tag', details: err.message });
    }
  }

  static async updateTag(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, tagName } = req.params;
      const { newTag } = req.body;
      if (!newTag || !newTag.trim()) {
        res.status(400).json({ error: 'New tag is required' });
        return;
      }
      const formattedNewTag = newTag.trim().replace(/\s+/g, '-');
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const index = category.tags.indexOf(decodeURIComponent(tagName));
      if (index === -1) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      if (category.tags.includes(formattedNewTag)) {
        res.status(400).json({ error: 'New tag already exists' });
        return;
      }
      category.tags[index] = formattedNewTag;
      await category.save();
      res.status(200).json({ tags: category.tags });
    } catch (err: any) {
      console.error('Error updating tag:', err);
      res.status(400).json({ error: 'Failed to update tag', details: err.message });
    }
  }

  static async deleteTag(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, tagName } = req.params;
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      if (!category.tags.includes(decodeURIComponent(tagName))) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      category.tags = category.tags.filter((tag: any) => tag !== decodeURIComponent(tagName));
      await category.save();
      res.status(200).json({ tags: category.tags });
    } catch (err: any) {
      console.error('Error deleting tag:', err);
      res.status(500).json({ error: 'Failed to delete tag', details: err.message });
    }
  }

  static async createBook(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategory, subSubCategory } = req.params;
      const { title, tags, seoTitle, seoDescription, price, description, estimatedDelivery, condition, author, publisher, imageUrl, quantityNew, quantityOld, discountNew, discountOld } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const bookData: Partial<IBook> = {
        bookName: title.trim(),
        categoryName: decodeURIComponent(categoryName),
        subCategory: subCategory ? decodeURIComponent(subCategory) : undefined,
        subSubCategory: subSubCategory ? decodeURIComponent(subSubCategory) : undefined,
        title: title.trim(),
        tags: typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim().replace(/\s+/g, '-')) : (tags || []).map((tag: string) => tag.trim().replace(/\s+/g, '-')),
        seoTitle,
        seoDescription,
        price,
        description,
        estimatedDelivery,
        condition,
        author,
        publisher,
        imageUrl,
        quantityNew: quantityNew ?? 0,
        quantityOld: quantityOld ?? 0,
        discountNew: discountNew ?? 0,
        discountOld: discountOld ?? 0,
      };

      if ('_id' in bookData) {
        delete bookData._id;
      }

      const category = await BookCategoryModel.findOne({ name: bookData.categoryName });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCat = category.subCategories.find((sub: any) => sub.name === bookData.subCategory);
      if (bookData.subCategory && !subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      if (bookData.subSubCategory && (!subCat || !subCat.subSubCategories.includes(bookData.subSubCategory))) {
        res.status(404).json({ error: 'Sub-subcategory not found' });
        return;
      }
      const book = new BookModel(bookData);
      await book.save();
      if (subCat) {
        subCat.books.push(book._id);
        await category.save();
      }
      res.status(201).json(book);
    } catch (err: any) {
      console.error('Error creating book:', err);
      res.status(400).json({ error: 'Failed to create book', details: err.message });
    }
  }

  static async getBookDetailsById(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.params;
      const book = await BookModel.findById(bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      res.status(200).json(book);
    } catch (err: any) {
      console.error('Error fetching book:', err);
      res.status(500).json({ error: 'Failed to fetch book', details: err.message });
    }
  }

  static async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { bookId, categoryName, subCategory, subSubCategory } = req.params;
      const { title, tags, seoTitle, seoDescription, price, description, estimatedDelivery, condition, author, publisher, imageUrl, quantityNew, quantityOld, discountNew, discountOld } = req.body;

      if (!title || !title.trim()) {
        res.status(400).json({ error: 'Title is required' });
        return;
      }

      const book = await BookModel.findById(bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      const oldCategoryName = book.categoryName;
      const oldSubCategory = book.subCategory;
      const newCategoryName = decodeURIComponent(categoryName);
      const newSubCategory = decodeURIComponent(subCategory);
      const newSubSubCategory = decodeURIComponent(subSubCategory);

      Object.assign(book, {
        bookName: title.trim(),
        categoryName: newCategoryName,
        subCategory: newSubCategory,
        subSubCategory: newSubSubCategory,
        title: title.trim(),
        tags: typeof tags === 'string' ? tags.split(',').map((tag: string) => tag.trim().replace(/\s+/g, '-')) : (tags || []).map((tag: string) => tag.trim().replace(/\s+/g, '-')),
        seoTitle,
        seoDescription,
        price,
        description,
        estimatedDelivery,
        condition,
        author,
        publisher,
        imageUrl,
        quantityNew: quantityNew ?? 0,
        quantityOld: quantityOld ?? 0,
        discountNew: discountNew ?? 0,
        discountOld: discountOld ?? 0,
      });

      await book.save();

      if (oldCategoryName !== newCategoryName || oldSubCategory !== newSubCategory) {
        const oldCategory = await BookCategoryModel.findOne({ name: oldCategoryName });
        if (oldCategory) {
          const oldSubCat = oldCategory.subCategories.find((sub: any) => sub.name === oldSubCategory);
          if (oldSubCat) {
            oldSubCat.books = oldSubCat.books.filter((id: any) => id.toString() !== bookId);
            await oldCategory.save();
          }
        }
        const newCategory = await BookCategoryModel.findOne({ name: newCategoryName });
        if (!newCategory) {
          res.status(404).json({ error: 'New category not found' });
          return;
        }
        const newSubCat = newCategory.subCategories.find((sub: any) => sub.name === newSubCategory);
        if (!newSubCat) {
          res.status(404).json({ error: 'New subcategory not found' });
          return;
        }
        if (!newSubCat.subSubCategories.includes(newSubSubCategory)) {
          res.status(404).json({ error: 'New sub-subcategory not found' });
          return;
        }
        newSubCat.books.push(book._id);
        await newCategory.save();
      }

      res.status(200).json(book);
    } catch (err: any) {
      console.error('Error updating book:', err);
      res.status(400).json({ error: 'Failed to update book', details: err.message });
    }
  }

  static async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { bookId, categoryName, subCategory } = req.params;
      const book = await BookModel.findByIdAndDelete(bookId);
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }
      const category = await BookCategoryModel.findOne({ name: decodeURIComponent(categoryName) });
      if (category) {
        const subCat = category.subCategories.find((sub: any) => sub.name === decodeURIComponent(subCategory));
        if (subCat) {
          subCat.books = subCat.books.filter((id: any) => id.toString() !== bookId);
          await category.save();
        }
      }
      res.status(200).json({ message: 'Book deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting book:', err);
      res.status(500).json({ error: 'Failed to delete book', details: err.message });
    }
  }

  static async deleteAllCategories(req: Request, res: Response): Promise<void> {
    try {
      await BookCategoryModel.deleteMany({});
      await BookModel.deleteMany({});
      res.status(200).json({ message: 'All categories and books deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting all categories:', err);
      res.status(500).json({ error: 'Failed to delete all categories', details: err.message });
    }
  }

  static async deleteAllBooks(req: Request, res: Response): Promise<void> {
    try {
      await BookModel.deleteMany({});
      const categories = await BookCategoryModel.find();
      for (const category of categories) {
        category.subCategories.forEach((sub: any) => (sub.books = []));
        await category.save();
      }
      res.status(200).json({ message: 'All books deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting books:', err);
      res.status(500).json({ error: 'Failed to delete books', details: err.message });
    }
  }
}

export default BookController;