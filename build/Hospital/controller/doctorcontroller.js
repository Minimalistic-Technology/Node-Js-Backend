"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllDoctors = exports.createDoctors = exports.createDoctorForLetter = exports.getDoctorById = exports.getDoctorsByLetter = exports.getAllDoctors = exports.getAlphabets = void 0;
const doctormodel_1 = __importDefault(require("../../models/hospital/doctormodel"));
// GET all alphabets (A-Z)
const getAlphabets = async (_req, res) => {
    try {
        const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        res.status(200).json(alphabets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alphabets', error });
    }
};
exports.getAlphabets = getAlphabets;
// GET all doctors irrespective of letter - limited fields
const getAllDoctors = async (_req, res) => {
    try {
        const doctors = await doctormodel_1.default.find({}, { photo: 1, name: 1, specialist: 1, location: 1 });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching all doctors', error });
    }
};
exports.getAllDoctors = getAllDoctors;
// GET doctors by letter (Dr. X...) - limited fields
const getDoctorsByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const regex = new RegExp(`^Dr\\.\\s${letter}`, 'i');
        const doctors = await doctormodel_1.default.find({ name: { $regex: regex } }, { photo: 1, name: 1, specialist: 1, location: 1 });
        res.status(200).json(doctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error });
    }
};
exports.getDoctorsByLetter = getDoctorsByLetter;
// GET doctor details by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await doctormodel_1.default.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({
            photo: doctor.photo,
            name: doctor.name,
            specialist: doctor.specialist,
            location: doctor.location,
            qualifications: doctor.qualifications,
            experience: doctor.experience,
            contact: doctor.contact,
            bio: doctor.bio,
            createdAt: doctor.createdAt,
            updatedAt: doctor.updatedAt,
            organization: 'Minimalistic'
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctor details', error });
    }
};
exports.getDoctorById = getDoctorById;
// POST new doctor(s) under a letter
const createDoctorForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        let doctors = Array.isArray(req.body) ? req.body : [req.body];
        const savedDoctors = [];
        for (const doctorData of doctors) {
            const { name, specialist, location, photo, qualifications, experience, contact, bio } = doctorData;
            if (!name || name[0].toUpperCase() !== letter) {
                return res.status(400).json({
                    message: `Doctor name must start with "${letter}"`,
                    providedName: name || 'No name provided'
                });
            }
            if (!specialist || !location || !photo) {
                return res.status(400).json({
                    message: 'Each doctor must include specialist, location, and photo'
                });
            }
            const doctor = new doctormodel_1.default({
                name,
                specialist,
                location,
                photo,
                qualifications: qualifications || [],
                experience: experience || '',
                contact: contact || { email: '', phone: '' },
                bio: bio || ''
            });
            const saved = await doctor.save();
            savedDoctors.push(saved);
        }
        res.status(201).json(savedDoctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating doctor(s)', error });
    }
};
exports.createDoctorForLetter = createDoctorForLetter;
// POST new doctor(s) irrespective of letter
const createDoctors = async (req, res) => {
    try {
        let doctors = Array.isArray(req.body) ? req.body : [req.body];
        const savedDoctors = [];
        for (const doctorData of doctors) {
            const { name, specialist, location, photo, qualifications, experience, contact, bio } = doctorData;
            if (!name || !specialist || !location || !photo) {
                return res.status(400).json({
                    message: 'Each doctor must include name, specialist, location, and photo',
                    providedData: { name, specialist, location, photo }
                });
            }
            const doctor = new doctormodel_1.default({
                name,
                specialist,
                location,
                photo,
                qualifications: qualifications || [],
                experience: experience || '',
                contact: contact || { email: '', phone: '' },
                bio: bio || ''
            });
            const saved = await doctor.save();
            savedDoctors.push(saved);
        }
        res.status(201).json(savedDoctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating doctor(s)', error });
    }
};
exports.createDoctors = createDoctors;
// DELETE all doctors irrespective of letter
const deleteAllDoctors = async (_req, res) => {
    try {
        const result = await doctormodel_1.default.deleteMany({});
        res.status(200).json({
            message: 'All doctors deleted successfully',
            deletedCount: result.deletedCount
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting all doctors', error });
    }
};
exports.deleteAllDoctors = deleteAllDoctors;
