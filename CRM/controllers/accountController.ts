import { Request, Response } from "express";
import { AccountModel } from "../models/account";

// Create
export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = new AccountModel(req.body);
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: "Failed to create account" });
  }
};

// Get All
export const getAllAccounts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await AccountModel.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

// Get by ID
export const getAccountById = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = await AccountModel.findById(req.params.id);
    if (!account)  res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: "Failed to get account" });
  }
};

// Update
export const updateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await AccountModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)  res.status(404).json({ error: "Account not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update account" });
  }
};

// Delete
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await AccountModel.findByIdAndDelete(req.params.id);
    if (!deleted)  res.status(404).json({ error: "Account not found" });
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete account" });
  }
};
