"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDoctorForLetter = exports.getDoctorById = exports.getDoctorsByLetter = exports.getAlphabets = void 0;
const doctormodel_1 = __importDefault(require("../../models/figma/doctormodel"));
// Return list of all alphabets (excluding J, Q, U, W, X, Y if needed later)
const getAlphabets = async (_req, res) => {
    try {
        const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
        res.json(alphabets);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alphabets', error: error.message });
    }
};
exports.getAlphabets = getAlphabets;
// Fetch doctors whose names start with a given letter
const getDoctorsByLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        const regex = new RegExp(`^Dr\\.\\s${letter}`, 'i');
        const doctors = await doctormodel_1.default.find({ name: { $regex: regex } }, { photo: 1, name: 1, specialist: 1, location: 1 });
        res.json(doctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching doctors', error: error.message });
    }
};
exports.getDoctorsByLetter = getDoctorsByLetter;
// Fetch doctor by ID
const getDoctorById = async (req, res) => {
    try {
        const doctor = await doctormodel_1.default.findById(req.params.id);
        if (!doctor) {
            res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({
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
        res.status(500).json({ message: 'Error fetching doctor details', error: error.message });
    }
};
exports.getDoctorById = getDoctorById;
// Add one or multiple doctors for a given letter
const createDoctorForLetter = async (req, res) => {
    try {
        const letter = req.params.letter.toUpperCase();
        let doctors = Array.isArray(req.body) ? req.body : [req.body];
        const savedDoctors = [];
        for (const doctorData of doctors) {
            const { name, specialist, location, photo, qualifications, experience, contact, bio } = doctorData;
            if (!name || !name.toUpperCase().startsWith(`DR. ${letter}`)) {
                res.status(400).json({
                    message: `Each doctor name must start with "Dr. ${letter}"`,
                    providedName: name || 'No name provided'
                });
            }
            if (!specialist || !location || !photo) {
                res.status(400).json({
                    message: 'Each doctor must have specialist, location, and photo'
                });
            }
            const newDoctor = new doctormodel_1.default({
                name,
                specialist,
                location,
                photo,
                qualifications: qualifications ?? [],
                experience: experience ?? '',
                contact: contact ?? { email: '', phone: '' },
                bio: bio ?? ''
            });
            const saved = await newDoctor.save();
            savedDoctors.push(saved);
        }
        res.status(201).json(savedDoctors);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating doctor(s)', error: error.message });
    }
};
exports.createDoctorForLetter = createDoctorForLetter;
