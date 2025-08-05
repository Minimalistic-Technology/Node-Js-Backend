import { Request, Response } from "express";
import { BookModel, BookCategoryModel, IBook, IBookCategory } from "../models/homepage";

class BookController {
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = (await BookCategoryModel.find().lean()) as IBookCategory[];
      res.status(200).json(categories);
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      res.status(500).json({ error: 'Failed to fetch categories', details: err.message });
    }
  }

  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      console.log('Request body:', req.body);
      const { name, tags, subCategories, seoTitle, seoDescription, categoryDiscount } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Category name is required' });
        return;
      }

      const formattedName = name.trim().replace(/\s+/g, '-');
      const existingCategory = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${formattedName}$`, 'i') } });
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
              subCategoryDiscount: sub.subCategoryDiscount || 0,
            }))
          : [],
        seoTitle,
        seoDescription,
        categoryDiscount: categoryDiscount || 0,
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
      console.log('Bulk request body:', req.body);
      const categories = req.body;

      if (!Array.isArray(categories) || categories.length === 0) {
        res.status(400).json({ error: 'Request body must be a non-empty array of categories' });
        return;
      }

      const createdCategories: IBookCategory[] = [];
      const errors: { name: string; error: string }[] = [];

      for (const cat of categories) {
        const { name, tags, subCategories, seoTitle, seoDescription, categoryDiscount } = cat;

        if (!name || !name.trim()) {
          errors.push({ name: name || 'undefined', error: 'Category name is required' });
          continue;
        }

        const formattedName = name.trim().replace(/\s+/g, '-');
        const existingCategory = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${formattedName}$`, 'i') } });
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
                subCategoryDiscount: sub.subCategoryDiscount || 0,
              }))
            : [],
          seoTitle,
          seoDescription,
          categoryDiscount: categoryDiscount || 0,
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

  static async setCategoryDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      const { discount } = req.body;

      if (typeof discount !== 'number' || discount < 0 || discount > 100) {
        res.status(400).json({ error: 'Discount must be a number between 0 and 100' });
        return;
      }

      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      category.categoryDiscount = discount;
      await category.save();
      res.status(200).json(category);
    } catch (err: any) {
      console.error('Error setting category discount:', err);
      res.status(400).json({ error: 'Failed to set category discount', details: err.message });
    }
  }

  static async setSubCategoryDiscount(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategory } = req.params;
      const { discount } = req.body;

      if (typeof discount !== 'number' || discount < 0 || discount > 100) {
        res.status(400).json({ error: 'Discount must be a number between 0 and 100' });
        return;
      }

      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      const subCat = category.subCategories.find((sub: any) => sub.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase());
      if (!subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }

      subCat.subCategoryDiscount = discount;
      await category.save();
      res.status(200).json(category);
    } catch (err: any) {
      console.error('Error setting subcategory discount:', err);
      res.status(400).json({ error: 'Failed to set subcategory discount', details: err.message });
    }
  }

  static async getCategoryByNameWithBooks(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName, subCategory, subSubCategory } = req.params;
      const category = (await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } }).lean()) as IBookCategory;
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }

      let booksQuery: any = { categoryName: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } };
      if (subCategory) {
        booksQuery.subCategory = { $regex: new RegExp(`^${decodeURIComponent(subCategory)}$`, 'i') };
      }
      if (subSubCategory) {
        booksQuery.subSubCategory = { $regex: new RegExp(`^${decodeURIComponent(subSubCategory)}$`, 'i') };
      }

      const books = (await BookModel.find(booksQuery).lean()) as IBook[];
      const subCat = subCategory
        ? category.subCategories.find((sub) => sub.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase())
        : null;

      const booksWithDiscount = books.map((book) => {
        const effectiveDiscount =
          subCat?.subCategoryDiscount && subCat.subCategoryDiscount > 0
            ? subCat.subCategoryDiscount
            : category.categoryDiscount && category.categoryDiscount > 0
            ? category.categoryDiscount
            : book.condition === 'new'
            ? book.discountNew || 0
            : book.discountOld || 0;
        const discountedPrice = book.price
          ? book.price * (1 - effectiveDiscount / 100)
          : book.price;
        return { ...book, effectiveDiscount, discountedPrice };
      });

      res.status(200).json({ ...category, books: booksWithDiscount });
    } catch (err: any) {
      console.error('Error fetching category with books:', err);
      res.status(500).json({ error: 'Failed to fetch category with books', details: err.message });
    }
  }

  static async getBookDetailsById(req: Request, res: Response): Promise<void> {
    try {
      const { bookId } = req.params;
      const book = (await BookModel.findById(bookId).lean()) as IBook;
      if (!book) {
        res.status(404).json({ error: 'Book not found' });
        return;
      }

      const category = (await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${book.categoryName}$`, 'i') } }).lean()) as IBookCategory;
      const subCat = category?.subCategories.find((sub) => sub.name.toLowerCase() === book.subCategory?.toLowerCase());

      const effectiveDiscount =
        subCat?.subCategoryDiscount && subCat.subCategoryDiscount > 0
          ? subCat.subCategoryDiscount
          : category?.categoryDiscount && category.categoryDiscount > 0
          ? category.categoryDiscount
          : book.condition === 'new'
          ? book.discountNew || 0
          : book.discountOld || 0;
      const discountedPrice = book.price
        ? book.price * (1 - effectiveDiscount / 100)
        : book.price;

      res.status(200).json({ ...book, effectiveDiscount, discountedPrice });
    } catch (err: any) {
      console.error('Error fetching book:', err);
      res.status(500).json({ error: 'Failed to fetch book', details: err.message });
    }
  }

  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, tags, subCategories, seoTitle, seoDescription, categoryDiscount } = req.body;

      if (name && !name.trim()) {
        res.status(400).json({ error: 'Category name cannot be empty' });
        return;
      }

      const updateData: Partial<IBookCategory> = {
        tags: tags ? tags.map((tag: string) => tag.trim().replace(/\s+/g, '-')) : [],
        subCategories: subCategories
          ? subCategories.map((sub: any) => ({
              name: sub.name.trim().replace(/\s+/g, '-'),
              subSubCategories: sub.subSubCategories
                ? sub.subSubCategories.map((subSub: string) => subSub.trim().replace(/\s+/g, '-'))
                : [],
              books: sub.books || [],
              subCategoryDiscount: sub.subCategoryDiscount || 0,
            }))
          : [],
        seoTitle,
        seoDescription,
        categoryDiscount: categoryDiscount || 0,
      };

      if (name) {
        updateData.name = name.trim().replace(/\s+/g, '-');
        const existingCategory = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${updateData.name}$`, 'i') } });
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
      await BookModel.deleteMany({ categoryName: { $regex: new RegExp(`^${category.name}$`, 'i') } });
      res.status(200).json({ message: 'Category and associated books deleted successfully' });
    } catch (err: any) {
      console.error('Error deleting category:', err);
      res.status(500).json({ error: 'Failed to delete category', details: err.message });
    }
  }

  static async createSubCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryName } = req.params;
      const { name, subSubCategories, subCategoryDiscount } = req.body;

      if (!name || !name.trim()) {
        res.status(400).json({ error: 'Subcategory name is required' });
        return;
      }

      const formattedName = name.trim().replace(/\s+/g, '-');
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      if (category.subCategories.some((sub: any) => sub.name.toLowerCase() === formattedName.toLowerCase())) {
        res.status(400).json({ error: 'Subcategory already exists' });
        return;
      }
      category.subCategories.push({
        name: formattedName,
        subSubCategories: subSubCategories
          ? subSubCategories.map((subSub: string) => subSub.trim().replace(/\s+/g, '-'))
          : [],
        books: [],
        subCategoryDiscount: subCategoryDiscount || 0,
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCategory = category.subCategories.find((sub: any) => sub.name.toLowerCase() === decodeURIComponent(subCategoryName).toLowerCase());
      if (!subCategory) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      category.subCategories = category.subCategories.filter(
        (sub: any) => sub.name.toLowerCase() !== decodeURIComponent(subCategoryName).toLowerCase()
      );
      await category.save();
      await BookModel.deleteMany({
        categoryName: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') },
        subCategory: { $regex: new RegExp(`^${decodeURIComponent(subCategoryName)}$`, 'i') },
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCat = category.subCategories.find((sub: any) => sub.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase());
      if (!subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      if (subCat.subSubCategories.some((subSub: string) => subSub.toLowerCase() === formattedName.toLowerCase())) {
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCat = category.subCategories.find((sub: any) => sub.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase());
      if (!subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      if (!subCat.subSubCategories.some((subSub: string) => subSub.toLowerCase() === decodeURIComponent(subSubCategoryName).toLowerCase())) {
        res.status(404).json({ error: 'Sub-subcategory not found' });
        return;
      }
      subCat.subSubCategories = subCat.subSubCategories.filter(
        (subSub: string) => subSub.toLowerCase() !== decodeURIComponent(subSubCategoryName).toLowerCase()
      );
      await category.save();
      await BookModel.deleteMany({
        categoryName: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') },
        subCategory: { $regex: new RegExp(`^${decodeURIComponent(subCategory)}$`, 'i') },
        subSubCategory: { $regex: new RegExp(`^${decodeURIComponent(subSubCategoryName)}$`, 'i') },
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      if (category.tags.some((t: string) => t.toLowerCase() === formattedTag.toLowerCase())) {
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const index = category.tags.findIndex((tag: string) => tag.toLowerCase() === decodeURIComponent(tagName).toLowerCase());
      if (index === -1) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      if (category.tags.some((t: string) => t.toLowerCase() === formattedNewTag.toLowerCase())) {
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      if (!category.tags.some((tag: string) => tag.toLowerCase() === decodeURIComponent(tagName).toLowerCase())) {
        res.status(404).json({ error: 'Tag not found' });
        return;
      }
      category.tags = category.tags.filter((tag: string) => tag.toLowerCase() !== decodeURIComponent(tagName).toLowerCase());
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

      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${bookData.categoryName}$`, 'i') } });
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      const subCat = category.subCategories.find((sub: any) => sub.name.toLowerCase() === bookData.subCategory?.toLowerCase());
      if (bookData.subCategory && !subCat) {
        res.status(404).json({ error: 'Subcategory not found' });
        return;
      }
      if (bookData.subSubCategory && (!subCat || !subCat.subSubCategories.some((subSub: string) => subSub.toLowerCase() === bookData.subSubCategory?.toLowerCase()))) {
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
      const newSubCategory = subCategory ? decodeURIComponent(subCategory) : '';
      const newSubSubCategory = subSubCategory ? decodeURIComponent(subSubCategory) : '';

      Object.assign(book, {
        bookName: title.trim(),
        categoryName: newCategoryName,
        subCategory: newSubCategory || undefined,
        subSubCategory: newSubSubCategory || undefined,
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

      if (oldCategoryName.toLowerCase() !== newCategoryName.toLowerCase() || oldSubCategory?.toLowerCase() !== newSubCategory?.toLowerCase()) {
        const oldCategory = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${oldCategoryName}$`, 'i') } });
        if (oldCategory) {
          const oldSubCat = oldCategory.subCategories.find((sub: any) => sub.name.toLowerCase() === oldSubCategory?.toLowerCase());
          if (oldSubCat) {
            oldSubCat.books = oldSubCat.books.filter((id: any) => id.toString() !== bookId);
            await oldCategory.save();
          }
        }
        const newCategory = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${newCategoryName}$`, 'i') } });
        if (!newCategory) {
          res.status(404).json({ error: 'New category not found' });
          return;
        }
        const newSubCat = newCategory.subCategories.find((sub: any) => sub.name.toLowerCase() === newSubCategory?.toLowerCase());
        if (newSubCategory && !newSubCat) {
          res.status(404).json({ error: 'New subcategory not found' });
          return;
        }
        if (newSubSubCategory && (!newSubCat || !newSubCat.subSubCategories.some((subSub: string) => subSub.toLowerCase() === newSubSubCategory.toLowerCase()))) {
          res.status(404).json({ error: 'New sub-subcategory not found' });
          return;
        }
        if (newSubCat) {
          newSubCat.books.push(book._id);
          await newCategory.save();
        }
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
      const category = await BookCategoryModel.findOne({ name: { $regex: new RegExp(`^${decodeURIComponent(categoryName)}$`, 'i') } });
      if (category) {
        const subCat = category.subCategories.find((sub: any) => sub.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase());
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