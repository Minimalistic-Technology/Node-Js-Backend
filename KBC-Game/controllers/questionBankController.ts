import { Request, Response } from "express";
import QuestionBank from "../models/QuestionBank";

export const getBanks = async (req: Request, res: Response): Promise<void> => {
  const { published, tag, ageGroup, ordered } = req.query;
  const filter: any = {};

  if (published) filter.published = published === "true";
  if (tag) filter.categories = tag;
  if (ageGroup) filter.ageGroup = ageGroup;

  let banks = await QuestionBank.find(filter);
  if (ordered) banks = banks.sort((a, b) => a.position - b.position);
  res.json(banks);
};

export const createBank = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;

  const count = await QuestionBank.countDocuments();
  data.position = count + 1;
  data.label = data.label || `Q${data.position}`;

  const bank = await QuestionBank.create({
    ...data,
    createdBy: (req as any).admin?._id || "admin",
  });
  res.status(201).json(bank);
};

export const getBank = async (req: Request, res: Response): Promise<void> => {
  const bank = await QuestionBank.findById(req.params.id);
  if (!bank) {
    res.status(404).json({ error: "Bank not found" });
    return;
  }
  res.json(bank);
};

export const updateBank = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const bank = await QuestionBank.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  if (!bank) {
    res.status(404).json({ error: "Bank not found" });
    return;
  }
  res.json(bank);
};

export const deleteBank = async (req: Request, res: Response): Promise<void> => {
  await QuestionBank.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
};

export const togglePublish = async (req: Request, res: Response): Promise<void> => {
  const bank = await QuestionBank.findById(req.params.id);
  if (!bank) {
    res.status(404).json({ error: "Bank not found" });
    return;
  }

  bank.published = !bank.published;
  await bank.save();
  res.json(bank);
};

export const reorderBanks = async (req: Request, res: Response): Promise<void> => {
  const { position } = req.body;
  const id = req.params.id;
  const allBanks = await QuestionBank.find().sort({ position: 1 });

  const current = allBanks.find((b) => b.id === id);
  if (!current) {
    res.status(404).json({ error: "Bank not found" });
    return;
  }

  allBanks.splice(current.position - 1, 1);
  allBanks.splice(position - 1, 0, current);

  for (let i = 0; i < allBanks.length; i++) {
    allBanks[i].position = i + 1;
    allBanks[i].label = `Q${i + 1}`;
    await allBanks[i].save();
  }

  res.json({ message: "Reordered successfully" });
};
