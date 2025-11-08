import * as XLSX from "xlsx";

type Q = {
  text: string;
  options: { text: string }[];
  correctIndex: number;
  categories?: string[];
  status: "published" | "draft";
};

const HEADER = [
  "Question",
  "Option A",
  "Option B",
  "Option C",
  "Option D",
  "Correct Option",
  "Category",
  "Status",
] as const;

export function indexToLetter(i: number): "A" | "B" | "C" | "D" {
  return (["A", "B", "C", "D"][i] ?? "A") as any;
}
export function buildExportRows(questions: any[], includeBank = false) {
  return questions.map((q) => {
    const a = q.options?.[0]?.text ?? "";
    const b = q.options?.[1]?.text ?? "";
    const c = q.options?.[2]?.text ?? "";
    const d = q.options?.[3]?.text ?? "";
    const correct = indexToLetter(q.correctIndex);
    const cats = (q.categories ?? []).join(", ");
    const base = {
      Question: q.text ?? "",
      "Option A": a,
      "Option B": b,
      "Option C": c,
      "Option D": d,
      "Correct Option": correct,
      Category: cats,
      Status: q.status,
    };
    return includeBank ? { Bank: q.bankName ?? "Unknown", ...base } : base;
  });
}
export function rowsToXlsxBuffer(rows: any[], sheetName = "Sheet1"): Buffer {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows, { header: [...HEADER] });
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

export function rowsToCsvBuffer(rows: any[]): Buffer {
  // Use XLSX to ensure identical columns/order as xlsx
  const ws = XLSX.utils.json_to_sheet(rows, { header: [...HEADER] });
  const csv = XLSX.utils.sheet_to_csv(ws);
  return Buffer.from(csv, "utf8");
}

export function sanitizeFilename(name: string) {
  const stamp = new Date()
    .toISOString()
    .replace(/[:.]/g, "-")
    .replace("T", "_")
    .replace("Z", "");
  return `${name}`.replace(/[^\w\-]+/g, "_") + "_" + stamp;
}