import { Request, Response } from "express";
import { AccountModel } from "../models/account";
import { NotificationModel } from "../models/notification";

export const createAccount = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = new AccountModel(req.body);
    await account.save();

    await NotificationModel.create({
      userId: req.body.owner,
      message: `New account created: ${account.name}`,
    });

    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ error: "Failed to create account" });
  }
};

export const getAllAccounts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const accounts = await AccountModel.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
};

export const getAccountById = async (req: Request, res: Response): Promise<void> => {
  try {
    const account = await AccountModel.findById(req.params.id);
    if (!account)  res.status(404).json({ error: "Account not found" });
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: "Failed to get account" });
  }
};

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
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to update account" });
  }
};

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
    });

    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(400).json({ error: "Failed to delete account" });
  }
};