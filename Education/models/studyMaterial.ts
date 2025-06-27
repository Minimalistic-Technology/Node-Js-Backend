import mongoose from "mongoose";

const StudyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ["pdf", "video", "article", "ebook"], required: true },
  course: String,
  courseId: String,
  instructor: String,
  pages: Number,
  fileSize: String,
  uploadDate: { type: Date, default: Date.now },
  category: String,
  difficulty: { type: String, enum: ["beginner", "intermediate", "advanced"] },
  isBookmarked: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  rating: { type: Number, min: 0, max: 5 },
  url: String,
});

export const StudyMaterialModel = mongoose.model("StudyMaterial", StudyMaterialSchema);
