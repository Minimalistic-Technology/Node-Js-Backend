import { Request, Response } from "express";
import Question from "../models/Question";
import { verifyMediaRefs } from "../userUtils/mediaValidator";
import { importQuestionsFromJSON } from "../userUtils/importQuestions";

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  const { bankId, status, q } = req.query;
  const filter: any = { deleted: false };
  if (bankId) filter.bankId = bankId;
  if (status) filter.status = status;
  if (q) filter.text = { $regex: q, $options: "i" };

  const questions = await Question.find(filter).sort({ createdAt: -1 });
  res.json(questions);
};

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  const { missing } = await verifyMediaRefs(data.mediaRefs || []);
  if (missing.length > 0) res.status(400).json({ error: `Missing media refs: ${missing.join(", ")}` });

  const question = await Question.create({
    ...data, 
    createdBy: (req as any).admin?._id || "admin",
  });
  res.status(201).json(question);
};

export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
  const question = await Question.findById(req.params.id);
  if (!question || question.deleted) {
    res.status(404).json({ error: "Question not found" });
    return;
  }
  res.json(question);
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  const existing = await Question.findById(req.params.id);
  if (!existing) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  existing.versions.push({
    snapshot: existing.toObject(),
    editedBy: (req as any).admin?._id || "admin",
    editedAt: new Date(),
  });

  Object.assign(existing, req.body);
  await existing.save();
  res.json(existing);
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  const q = await Question.findById(req.params.id);
  if (!q) {
    res.status(404).json({ error: "Question not found" });
    return;
  }
  q.deleted = true;
  await q.save();
  res.json({ message: "Question soft-deleted" });
};

export const bulkImportQuestions = async (req: Request, res: Response): Promise<void> => {
  const rows = req.body;
  const report = await importQuestionsFromJSON(rows);
  res.json(report);
};

export const previewQuestion = async (req: Request, res: Response): Promise<void> => {
  const question = await Question.findById(req.params.id);
  if (!question) {
    res.status(404).json({ error: "Question not found" });
    return;
  }

  const payload = {
    text: question.text,
    options: question.options.map((o) => o.text),
    media: question.mediaRefs,
  };
  res.json(payload);
};
