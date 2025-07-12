import mongoose from "mongoose";

const AdminProfileSchema = new mongoose.Schema({
  personalInfo: {
    fullName: { type: String, required: true },
    employeeId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone: String,
    dateOfBirth: Date,
    address: String,
    emergencyContact: String,
    bloodGroup: String,
  },
  professional: {
    jobTitle: String,
    department: String,
    reportingManager: String,
    employmentType: String,
    joiningDate: Date,
    yearsOfExperience: Number,
    officeLocation: String,
    workHours: String,
  },
  administrative: {
    accessLevel: String,
    permissions: [String],
    managedDepartments: [String],
    directReports: [String],
    systemRoles: [String],
  }
});

export const AdminProfileModel = mongoose.model("AdminProfile", AdminProfileSchema);
