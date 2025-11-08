import type { Request, Response } from "express";
import ImportJob from "../models/ImportJob";
import { importQuestionsFromJSON } from "../userUtils/importQuestions";
import Question from "../models/Question";
import QuestionBank from "../models/QuestionBank"; 
import mongoose from "mongoose";
import {
  parseInputData,
  normalizeRow,
  IMPORT_MAX_ROWS,
} from "../userUtils/importHelpers";

import {
  buildExportRows,
  rowsToXlsxBuffer,
  rowsToCsvBuffer,
  sanitizeFilename,
} from "../userUtils/exportHelpers";

type Status = "published" | "draft" | "all";
type Format = "csv" | "excel" | "xlsx";



export const importQuestions = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "File required" });
      return;
    }
    const { bankId } = req.body as { bankId?: string };
    if (!bankId) {
      res.status(400).json({ error: "bankId required" });
      return;
    }

    // 1️⃣ Parse rows
    const rawRows = parseInputData(
      req.file.buffer,
      req.file.mimetype,
      req.file.originalname
    ).filter((r: any) =>
      Object.values(r).some((v) => String(v ?? "").trim() !== "")
    );

    // 2️⃣ Normalize to expected shape
    const rows = rawRows.map(normalizeRow);

    // 3️⃣ Decide inline vs background
    if (rows.length > IMPORT_MAX_ROWS) {
      const job = await ImportJob.create({
        status: "processing",
        totalRows: rows.length,
        bankId,
      });

      importQuestionsFromJSON(rows, job._id.toString(), bankId);

      res.json({ message: "Import started in background", jobId: job._id });
      return;
    }

    // Small imports run inline
    const report = await importQuestionsFromJSON(rows, undefined, bankId);
    res.json({ report });
  } catch (err: any) {
    console.error("Import error:", err);
    res.status(500).json({ error: err.message ?? "Import failed" });
  }
};



export const exportQuestions = async (req: Request, res: Response) => {
  try {
    const bankId = (req.query.bankId as string)?.toLowerCase();
    const status = (req.query.status as string)?.toLowerCase() || "all";
    const format = (req.query.format as string)?.toLowerCase() || "csv";

    if (!bankId) {
      return res.status(400).json({ error: "bankId required (specific ID or 'all')" });
    }

    if (!["csv", "xlsx", "excel", "json"].includes(format)) {
      return res.status(400).json({ error: "Invalid format (csv, xlsx, json allowed)" });
    }

    // 🔍 Common filter for question status
    const statusFilter: any = status !== "all" ? { status } : {};

    let questions: any[] = [];
    let filenamePrefix = "";

    // 🏦 Case 1: ALL banks
    if (bankId === "all") {
      const banks = await QuestionBank.find({ enabled: true }).select({ _id: 1, name: 1 }).lean();

      // Fetch questions for all banks
      const all = await Question.find({
        deleted: { $ne: true },
        ...statusFilter,
      })
        .select({
          bankId: 1,
          text: 1,
          options: 1,
          correctIndex: 1,
          categories: 1,
          status: 1,
        })
        .lean();

      // Map bank names into each question for export clarity
      const bankNameMap = new Map(banks.map((b) => [b._id.toString(), b.name]));
      questions = all.map((q) => ({
        ...q,
        bankName: bankNameMap.get(q.bankId.toString()) || "Unknown Bank",
      }));

      filenamePrefix = "all_banks";
    }
    // 🏦 Case 2: Single bank
    else {
      if (!mongoose.isValidObjectId(bankId)) {
        return res.status(400).json({ error: "Invalid bankId" });
      }

      const bank = await QuestionBank.findById(bankId)
        .select({ name: 1 })
        .lean()
        .catch(() => null);

      const bankName = bank?.name || `bank_${bankId.slice(-6)}`;

      questions = await Question.find({
        bankId: new mongoose.Types.ObjectId(bankId),
        deleted: { $ne: true },
        ...statusFilter,
      })
        .select({
          text: 1,
          options: 1,
          correctIndex: 1,
          categories: 1,
          status: 1,
        })
        .lean();

      // Add bank name for consistency
      questions = questions.map((q) => ({ ...q, bankName }));
      filenamePrefix = bankName;
    }

    // 🧩 Build rows (add bank column)
    const rows = buildExportRows(questions, true); // true = include Bank column
    const baseName = sanitizeFilename(`${filenamePrefix}_${status}_questions`);

    // 🧾 Handle formats
    if (format === "json") {
      res
        .setHeader("Content-Type", "application/json")
        .setHeader("Content-Disposition", `attachment; filename="${baseName}.json"`)
        .send(JSON.stringify(rows, null, 2));
      return;
    }

    if (format === "xlsx" || format === "excel") {
      const buf = rowsToXlsxBuffer(rows, "Questions");
      res
        .setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        .setHeader("Content-Disposition", `attachment; filename="${baseName}.xlsx"`)
        .send(buf);
    } else {
      const buf = rowsToCsvBuffer(rows);
      res
        .setHeader("Content-Type", "text/csv; charset=utf-8")
        .setHeader("Content-Disposition", `attachment; filename="${baseName}.csv"`)
        .send(buf);
    }
  } catch (err: any) {
    console.error("Export error:", err);
    res.status(500).json({ error: err.message ?? "Export failed" });
  }
};
