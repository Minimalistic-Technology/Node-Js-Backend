import { Request, Response } from 'express';
import { Category } from '../../BookStore/models/category';

export class CategoryController {
  // Get all categories/tags
  static async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // Get single category/tag by ID
  static async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(404).json({ message: 'Category/Tag not found' });
        return;
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  // Create new category/tag
  static async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryData = {
        name: req.body.name,
        type: req.body.type, // Use 'type' instead of 'category'
        seoTitle: req.body.seoTitle,
        seoDescription: req.body.seoDescription
      };

      const category = new Category(categoryData);
      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // Update category/tag
  static async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(404).json({ message: 'Category/Tag not found' });
        return;
      }

      category.name = req.body.name || category.name;
      category.type = req.body.type || category.type; // Use 'type' instead of 'category'
      category.seoTitle = req.body.seoTitle || category.seoTitle;
      category.seoDescription = req.body.seoDescription || category.seoDescription;

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  // Delete category/tag
  static async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        res.status(404).json({ message: 'Category/Tag not found' });
        return;
      }
      
      await category.deleteOne();
      res.json({ message: 'Category/Tag deleted' });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}