import Question from "../models/Question";
import { verifyMediaRefs } from "../userUtils/mediaValidator";
import ImportJob from "../models/ImportJob";
import csvParser from "csv-parse/sync";

export async function importQuestionsFromJSON(rows: any[], jobId?: string) {
  const report: any[] = [];
  let successCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      if (!row.bankId || !row.text) throw new Error("bankId and text required");
      if (!Array.isArray(row.options) || row.options.length !== 4)
        throw new Error("options must be array of 4");
      if (row.correctIndex < 0 || row.correctIndex > 3)
        throw new Error("correctIndex invalid");

      const { missing } = await verifyMediaRefs(row.mediaRefs || []);
      if (missing.length > 0) throw new Error(`Missing media refs: ${missing.join(",")}`);

      await Question.findOneAndUpdate(
        { bankId: row.bankId, text: row.text },
        { ...row, createdBy: row.createdBy || "import" },
        { upsert: true, new: true }
      );

      successCount++;
      report.push({ row: i + 1, success: true });
    } catch (err: any) {
      report.push({ row: i + 1, success: false, error: err.message });
    }
  }

  if (jobId) {
    await ImportJob.findByIdAndUpdate(jobId, {
      status: "completed",
      successCount,
      totalRows: rows.length,
      errorRows: report.filter((r) => !r.success),
    });
  }

  return report;
}

export function parseInputData(fileBuffer: Buffer, mimetype: string) {
  if (mimetype.includes("json")) {
    return JSON.parse(fileBuffer.toString());
  } else if (mimetype.includes("csv")) {
    const records = csvParser.parse(fileBuffer.toString(), {
      columns: true,
      skip_empty_lines: true,
    });
    return records;
  }
  throw new Error("Unsupported file format");
}
