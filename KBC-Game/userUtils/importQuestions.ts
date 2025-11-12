// import Question from "../models/Question";
// import { verifyMediaRefs } from "../userUtils/mediaValidator";
// import ImportJob from "../models/ImportJob";
// import { parse as parseCsv } from "csv-parse/sync";

// export async function importQuestionsFromJSON(rows: any[], jobId?: string, bankId?: string) {
//   const report: any[] = [];
//   let successCount = 0;

//   for (let i = 0; i < rows.length; i++) {
//     const row = rows[i];
//     try {
//       // ✅ attach bankId if not in row
//       if (!row.bankId && bankId) row.bankId = bankId;

//       if (!row.bankId || !row.text) throw new Error("bankId and text required");
//       if (!Array.isArray(row.options) || row.options.length !== 4)
//         throw new Error("options must be array of 4");
//       if (row.correctIndex < 0 || row.correctIndex > 3)
//         throw new Error("correctIndex invalid");

//       const { missing } = await verifyMediaRefs(row.mediaRefs || []);
//       if (missing.length > 0) throw new Error(`Missing media refs: ${missing.join(",")}`);

//       await Question.findOneAndUpdate(
//         { bankId: row.bankId, text: row.text },
//         { ...row, createdBy: row.createdBy || "import" },
//         { upsert: true, new: true }
//       );

//       successCount++;
//       report.push({ row: i + 1, success: true });
//     } catch (err: any) {
//       report.push({ row: i + 1, success: false, error: err.message });
//     }
//   }

//   if (jobId) {
//     await ImportJob.findByIdAndUpdate(jobId, {
//       status: "completed",
//       successCount,
//       totalRows: rows.length,
//       errorRows: report.filter((r) => !r.success),
//     });
//   }

//   return report;
// }

// export function parseInputData(fileBuffer: Buffer, mimetype: string) {
//   if (mimetype.includes("json")) {
//     return JSON.parse(fileBuffer.toString());
//   } else if (mimetype.includes("csv")) {
//     const records = parseCsv(fileBuffer.toString(), {
//       columns: true,
//       skip_empty_lines: true,
//     });
//     return records;
//   }
//   throw new Error("Unsupported file format");
// }


// userUtils/importQuestions.ts
import mongoose from "mongoose";
import Question from "../models/Question";
import ImportJob from "../models/ImportJob";

export async function importQuestionsFromJSON(
  rows: Array<{ lang: any; correctIndex: number; status: "draft" | "published" }>,
  jobId?: string,
  bankId?: string
) {
  const report: Array<{ row: number; success: boolean; error?: string }> = [];
  let successCount = 0;

  for (let i = 0; i < rows.length; i++) {
    try {
      if (!bankId) throw new Error("bankId required");
      const r = rows[i];

      // basic checks (schema will re-validate on save)
      if (!r.lang?.en?.text) throw new Error("lang.en.text required");
      const blocks = [r.lang.en, r.lang.hi, r.lang.gu].filter(Boolean);
      for (const b of blocks) {
        if (!Array.isArray(b.options) || b.options.length !== 4) {
          throw new Error("Each language block must have exactly 4 options");
        }
      }
      if (typeof r.correctIndex !== "number" || r.correctIndex < 0 || r.correctIndex > 3) {
        throw new Error("correctIndex invalid");
      }

      const filter = {
        bankId: new mongoose.Types.ObjectId(bankId),
        "lang.en.text": r.lang.en.text,
      };

      const update = {
        $set: {
          bankId: new mongoose.Types.ObjectId(bankId),
          lang: r.lang,
          correctIndex: r.correctIndex,
          status: r.status ?? "draft",
          createdBy: "import",
          deleted: false,
        },
      };

      await Question.findOneAndUpdate(filter, update, { upsert: true, new: true });
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
