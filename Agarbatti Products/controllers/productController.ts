import { Request, Response } from "express";
import { ProductModel } from "../models/product";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = new ProductModel(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to create product" });
  }
};

export const getAllProducts = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get product" });
  }
};

export const getRelatedProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const related = await ProductModel.find({
      productId: { $in: product.related },
    });
    res.json(related);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get related products" });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await ProductModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to update product" });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const deleted = await ProductModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Failed to delete product" });
  }
};