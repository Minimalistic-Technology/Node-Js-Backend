import { Request, Response } from 'express';
import { ProductCategoryModel } from '../models/category';

export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = new ProductCategoryModel(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create category' });
  }
};

export const getAllCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await ProductCategoryModel.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await ProductCategoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated)  res.status(404).json({ error: 'Category not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update category' });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ProductCategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete category' });
  }
};
