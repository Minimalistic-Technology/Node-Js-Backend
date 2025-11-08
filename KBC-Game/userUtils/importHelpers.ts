import * as XLSX from "xlsx";
import { parse as parseCsv } from "csv-parse/sync";

export const IMPORT_MAX_ROWS = Number(process.env.IMPORT_MAX_ROWS ?? 500);

// Allowed file types
const SUPPORTED_MIMES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel",                                          // .xls
  "text/csv",
  "application/csv",
  "application/octet-stream", // fallback
]);

/** Map A/B/C/D or 1/2/3/4 to 0..3 */
export function letterToIndex(letter: string | number): number {
  const v = String(letter ?? "").trim();
  if (/^[1-4]$/.test(v)) return Number(v) - 1;
  const idx = "ABCD".indexOf(v.toUpperCase());
  if (idx === -1) throw new Error(`Invalid "Correct Option": ${letter}`);
  return idx;
}

/** Normalize row into standard question object */
export function normalizeRow(row: any) {
  const text = row["Question"] ?? row["question"] ?? row["Text"];
  if (!text || !String(text).trim()) throw new Error("Missing 'Question' column");

  const optionsRaw = [
    row["Option A"] ?? row["A"],
    row["Option B"] ?? row["B"],
    row["Option C"] ?? row["C"],
    row["Option D"] ?? row["D"],
  ];
  const options = optionsRaw.map((v) => ({ text: String(v ?? "").trim() }));
  if (options.some((o) => !o.text)) {
    throw new Error("Each of 'Option A'...'Option D' must be provided");
  }

  const correctIndex = letterToIndex(
    row["Correct Option"] ?? row["Correct"] ?? row["Answer"]
  );

  const categories = row["Category"]
    ? String(row["Category"])
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const statusRaw = String(row["Status"] ?? "Published").toLowerCase();
  const status = statusRaw === "draft" ? "draft" : "published";

  return { text: String(text).trim(), options, correctIndex, categories, status };
}

/** Read first sheet from Excel as JSON */
function readFirstSheetToJson(buffer: Buffer) {
  const wb = XLSX.read(buffer, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  const ws = wb.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(ws, { defval: "" });
}

/** Parse CSV to JSON */
function parseCsvBuffer(buffer: Buffer) {
  const csvText = buffer.toString("utf8");
  return parseCsv(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
}

/** Extract extension from filename */
function getExt(filename?: string) {
  const n = (filename || "").toLowerCase();
  if (n.endsWith(".xlsx")) return "xlsx";
  if (n.endsWith(".xls")) return "xls";
  if (n.endsWith(".csv")) return "csv";
  return "";
}

/** Parse buffer (XLSX or CSV) into objects */
export function parseInputData(
  buffer: Buffer,
  mimetype?: string,
  originalname?: string
): any[] {
  if (!buffer || buffer.length === 0) throw new Error("Empty file buffer");

  const mimeOk = mimetype && SUPPORTED_MIMES.has(mimetype);
  const ext = getExt(originalname);

  const useXlsx = mimeOk
    ? mimetype?.includes("spreadsheetml") || mimetype === "application/vnd.ms-excel"
    : ext === "xlsx" || ext === "xls";

  const useCsv = mimeOk
    ? mimetype?.includes("csv") || mimetype === "text/csv"
    : ext === "csv";

  if (useXlsx) return readFirstSheetToJson(buffer);
  if (useCsv) return parseCsvBuffer(buffer);

  // Fallback try XLSX -> CSV
  try {
    return readFirstSheetToJson(buffer);
  } catch {
    try {
      return parseCsvBuffer(buffer);
    } catch {
      throw new Error("Unsupported file format");
    }
  }
}