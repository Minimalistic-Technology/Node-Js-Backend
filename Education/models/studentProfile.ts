import mongoose from "mongoose";

const StudentProfileSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    dateOfBirth: Date,
    address: String,
    emergencyContact: String,
    bloodGroup: String,
  },
  academic: {
    program: String,
    year: Number,
    semester: Number,
    batch: String,
    advisor: String,
    enrollmentDate: Date,
    expectedGraduation: Date,
  },
  performance: {
    currentGPA: { type: Number, min: 0, max: 4.0 },
  }
});

export const StudentProfileModel = mongoose.model("StudentProfile", StudentProfileSchema);
