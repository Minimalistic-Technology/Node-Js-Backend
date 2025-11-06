import { Request, Response } from "express";
import ImportJob from "../models/ImportJob";
import Question from "../models/Question";
import { importQuestionsFromJSON, parseInputData } from "../userUtils/importQuestions";
import { createReadStream } from "streamifier";
import { Parser as Json2CsvParser } from "json2csv";

const IMPORT_MAX_ROWS = parseInt(process.env.IMPORT_MAX_ROWS!, 10);
const IMPORT_WORKER_CONCURRENCY = parseInt(process.env.IMPORT_WORKER_CONCURRENCY!, 10);

export const importQuestions = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "File required" });
      return;
    }

    const rows = parseInputData(req.file.buffer, req.file.mimetype);

    if (rows.length > IMPORT_MAX_ROWS) {
      const job = await ImportJob.create({
        status: "processing",
        totalRows: rows.length,
      });

      importQuestionsFromJSON(rows, job._id.toString());
      res.json({ message: "Import started in background", jobId: job._id });
    } else {
      const report = await importQuestionsFromJSON(rows);
      res.json({ report });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const exportQuestions = async (req: Request, res: Response) => {
  try {
    const { bankId, format } = req.query;
    const filter: any = {};
    if (bankId) filter.bankId = bankId;

    const questions = await Question.find(filter).lean();

    if (format === "csv" || req.headers.accept?.includes("text/csv")) {
      const parser = new Json2CsvParser({ fields: Object.keys(questions[0] || {}) });
      const csv = parser.parse(questions);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=questions.csv");
      res.send(csv);
    } else {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=questions.json");
      res.json(questions);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getImportJobStatus = async (req: Request, res: Response) => {
  const job = await ImportJob.findById(req.params.id);
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(job);
};
