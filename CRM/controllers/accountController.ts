import { Request, Response } from "express";
import { AccountModel } from "../models/account";
import { NotificationModel } from "../models/notification";

// Create Account
export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = new AccountModel(req.body);
    await account.save();

    await NotificationModel.create({
      userId: req.body.owner,
      message: `New account created: ${account.name}`,
      type: "account", // MUST match enum: "account", not "Account"
    });

    res.status(201).json(account);
  } catch (err: any) {
    if (err.code === 11000) {
      // Duplicate key error
      res.status(400).json({ error: "Account number already exists. Please use a unique number." });
    } else {
      res.status(400).json({ error: err.message || "Failed to create account" });
    }
  }
};

// Get All Accounts
export const getAllAccounts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await AccountModel.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

// Get Account by ID (ensure valid ObjectId)
export const getAccountById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
       res.status(400).json({ error: "Invalid account ID format" });
       return;
    }

    const account = await AccountModel.findById(id);
    if (!account) {
     res.status(404).json({ error: "Account not found" });
    }

    res.json(account);
  } catch (err) {
    res.status(500).json({ error: "Failed to get account" });
  }
};

// Update Account
export const updateAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const updated = await AccountModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) {
     res.status(404).json({ error: "Account not found" });
     return;
    }

    await NotificationModel.create({
      userId: req.body.owner,
      message: `Account updated: ${updated.name}`,
      type: "account",
    });

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Failed to update account" });
  }
};

// Delete Account
export const deleteAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await AccountModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
       res.status(404).json({ error: "Account not found" });
       return;
    }

    await NotificationModel.create({
      userId: deleted.owner,
      message: `Account deleted: ${deleted.name}`,
      type: "account",
    });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account" });
  }
};
