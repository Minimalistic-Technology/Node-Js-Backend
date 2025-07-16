import { Request, Response } from 'express';
import ProductTool, { ProductToolDocument } from '../models/productTool';

// Add one or multiple product tools
export const addProductTool = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: ProductToolDocument[] = Array.isArray(req.body) ? req.body : [req.body];
    const result = await ProductTool.insertMany(data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all product tools
export const getAllProductTools = async (_req: Request, res: Response): Promise<void> => {
  try {
    const tools = await ProductTool.find();
    res.status(200).json(tools);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get a product tool by ID
export const getProductToolById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tool = await ProductTool.findById(req.params.id);
    if (!tool) {
      res.status(404).json({ error: 'Tool not found' });
    } else {
      res.status(200).json(tool);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product tool by ID
export const updateProductTool = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await ProductTool.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
      res.status(404).json({ error: 'Tool not found' });
    } else {
      res.status(200).json(updated);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product tool by ID
export const deleteProductTool = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await ProductTool.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Tool not found' });
    } else {
      res.status(200).json({ message: 'Tool deleted successfully' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
