import { Request, Response } from "express";
import { ProductModel } from "../models/product";

// CREATE product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Create Error:", err);
    res.status(400).json({ error: "Failed to create product" });
  }
};

// READ: Get all products
export const getAllProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    console.error("Fetch All Error:", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// READ: Get product by _id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error("Fetch By ID Error:", err);
    res.status(500).json({ error: "Failed to get product" });
  }
};

// READ: Get related products by product's `related` field
export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const relatedProducts = await ProductModel.find({
      productId: { $in: product.related }
    });

    res.json(relatedProducts);
  } catch (err) {
    console.error("Get Related Error:", err);
    res.status(500).json({ error: "Failed to get related products" });
  }
};

// UPDATE product by _id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(400).json({ error: "Failed to update product" });
  }
};

// DELETE product by _id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(400).json({ error: "Failed to delete product" });
  }
};