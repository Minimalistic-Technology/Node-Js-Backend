
import { Request, Response } from "express";
import cloudinary from "../userUtils/cloudinaryClient";
import Question from "../models/Question";
import { importQuestionsFromJSON } from "../userUtils/importQuestions";
import stream from "stream";

/* ------------------------- Utils ------------------------- */

const parseMaybeJSON = <T = any>(v: any): T => {
  if (v == null) return v as T;
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return v as T; }
  }
  return v as T;
};

type LangKey = "en" | "hi" | "gu";
const LANG_KEYS: LangKey[] = ["en", "hi", "gu"];

type LooseLangBlock = {
  text?: any;
  options?: any;
  categories?: any;
};

/** Only materialize a language block if it has meaningful content */
const normalizeLangBlock = (block?: LooseLangBlock) => {
  if (!block) return undefined;

  const text =
    typeof block.text === "string"
      ? block.text
      : block.text?.toString?.() ?? "";

  let options = parseMaybeJSON(block.options);
  let categories = parseMaybeJSON(block.categories);

  if (Array.isArray(options)) {
    options = options.slice(0, 4); // ensure max 4
  } else {
    options = undefined;
  }

  if (!Array.isArray(categories)) {
    categories = [];
  }

  const hasContent =
    (text?.trim()?.length ?? 0) > 0 ||
    (Array.isArray(options) && options.length > 0) ||
    (Array.isArray(categories) && categories.length > 0);

  if (!hasContent) return undefined;

  return { text, options, categories };
};

/** Map legacy top-level {text, options, categories} to lang.en if no lang object */
const coerceLegacyToLang = (data: any) => {
  const hasNew = data.lang && typeof data.lang === "object";
  if (hasNew) return data;

  const text = data.text;
  let options = parseMaybeJSON(data.options);
  let categories = parseMaybeJSON(data.categories);
  if (!Array.isArray(categories)) categories = categories ? [String(categories)] : [];
  return {
    ...data,
    lang: {
      en: { text, options, categories }
    }
  };
};

/** Validate that each present language (en required) has exactly 4 options */
const ensureOptionsCounts = (lang: any) => {
  if (!lang?.en) throw new Error("lang.en is required.");
  const check = (b?: any) => !b || (Array.isArray(b.options) && b.options.length === 4);
  if (!check(lang.en)) throw new Error("lang.en must have exactly 4 options.");
  if (!check(lang.hi)) throw new Error("lang.hi must have exactly 4 options when provided.");
  if (!check(lang.gu)) throw new Error("lang.gu must have exactly 4 options when provided.");
};

/** Build $or filter for q across existing language texts */
const buildTextSearch = (q: string) => {
  const regex = { $regex: q, $options: "i" };
  return {
    $or: [
      { "lang.en.text": regex },
      { "lang.hi.text": regex },
      { "lang.gu.text": regex },
    ]
  };
};

/** Parse JSON-like fields from multipart/form-data */
const parseIncomingJsonFields = (data: any) => {
  if (typeof data.lang === "string") {
    try { data.lang = JSON.parse(data.lang); } catch {}
  }
  if (typeof data.correctIndex === "string") {
    data.correctIndex = parseInt(data.correctIndex, 10);
  }
  if (typeof data.options === "string") {
    try { data.options = JSON.parse(data.options); } catch {}
  }
  if (typeof data.categories === "string") {
    try { data.categories = JSON.parse(data.categories); } catch {}
  }
  return data;
};

/** Cloudinary single upload from req.file -> mediaRef */
const uploadSingleToCloudinary = async (file?: Express.Multer.File) => {
  if (!file) return undefined;
  const result: any = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(file.buffer);
    bufferStream.pipe(uploadStream);
  });

  return {
    public_id: result.public_id,
    url: result.secure_url,
    type: result.resource_type,
    format: result.format,
  };
};

/* ------------------------- Controllers ------------------------- */

export const createQuestion = async (req: Request, res: Response) => {
  try {
    let data: any = req.body || {};

    // 1) parse JSON-like fields first
    data = parseIncomingJsonFields(data);

    // 2) accept legacy top-level fields if lang absent
    data = coerceLegacyToLang(data);

    // 3) normalize language blocks
    const incomingLang = data.lang || {};
    const normalizedLang: any = {};
    for (const k of LANG_KEYS) {
      normalizedLang[k] = normalizeLangBlock(incomingLang[k]);
    }

    // 4) Ensure en exists, remove empty optional blocks
    if (!normalizedLang.en) throw new Error("English (lang.en) is required.");
    if (!normalizedLang.hi) delete normalizedLang.hi;
    if (!normalizedLang.gu) delete normalizedLang.gu;

    // 5) media (optional)
    const mediaRef = await uploadSingleToCloudinary(req.file);
    if (mediaRef) data.mediaRef = mediaRef;

    // 6) attach lang + validate
    data.lang = normalizedLang;
    ensureOptionsCounts(data.lang);

    // 7) persist
    const question = await Question.create({
      ...data,
      createdBy: (req as any).admin?._id || "admin",
    });

    res.status(201).json({ success: true, question });
  } catch (err: any) {
    console.error("Error in createQuestion:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bankId, status, q } = req.query;
    const filter: any = { deleted: false };
    if (bankId) filter.bankId = bankId;
    if (status) filter.status = status;

    if (q && typeof q === "string" && q.trim()) {
      Object.assign(filter, buildTextSearch(q.trim()));
    }

    const questions = await Question.find(filter).sort({ createdAt: -1 });
    res.json(questions);
  } catch (err: any) {
    console.error("Error in getQuestions:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export const getQuestionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question || question.deleted) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    res.json(question);
  } catch (err: any) {
    console.error("Error in getQuestionById:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const existing = await Question.findById(req.params.id);
    if (!existing) {
      res.status(404).json({ error: "Question not found" });
      return;
    }

    // versioning snapshot
    (existing as any).versions.push({
      snapshot: existing.toObject(),
      editedBy: (req as any).admin?._id || "admin",
      editedAt: new Date(),
    });

    // 1) parse JSON-like fields
    const raw: any = parseIncomingJsonFields(req.body || {});

    // 2) legacy -> lang.en if needed
    const merged = coerceLegacyToLang({ ...raw });

    // 3) prepare next lang (merge with existing)
    const nextLang: any =
      (existing as any).lang?.toObject?.() ||
      (existing as any).lang ||
      {};

    if (merged.lang) {
      for (const k of LANG_KEYS) {
        if (merged.lang[k] !== undefined) {
          const normalized = normalizeLangBlock(merged.lang[k]);
          if (normalized) {
            nextLang[k] = { ...(nextLang[k] || {}), ...normalized };
          } else if (k !== "en") {
            // allow clearing optional langs by sending "empty" block
            delete nextLang[k];
          }
        }
      }
    }

    // 4) media replacement (optional)
    const mediaRef = await uploadSingleToCloudinary(req.file as any);
    if (mediaRef) (merged as any).mediaRef = mediaRef;

    // 5) apply lang + other fields
    (existing as any).lang = nextLang;
    const { lang: _discard, ...rest } = merged;
    Object.assign(existing, rest);

    // 6) validate languages & options
    ensureOptionsCounts((existing as any).lang);

    await existing.save();
    res.json({ success: true, question: existing });
  } catch (err: any) {
    console.error("Error in updateQuestion:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = await Question.findById(req.params.id);
    if (!q) {
      res.status(404).json({ error: "Question not found" });
      return;
    }
    (q as any).deleted = true;
    await q.save();
    res.json({ message: "Question soft-deleted" });
  } catch (err: any) {
    console.error("Error in deleteQuestion:", err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};