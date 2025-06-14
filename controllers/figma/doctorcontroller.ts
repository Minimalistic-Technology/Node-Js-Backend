import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Doctor from '../../models/figma/doctormodel';

// Return list of all alphabets (excluding J, Q, U, W, X, Y if needed later)
export const getAlphabets = async (_req: Request, res: Response): Promise<void> => {
  try {
    const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    res.json(alphabets);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching alphabets', error: error.message });
  }
};

// Fetch doctors whose names start with a given letter
export const getDoctorsByLetter = async (req: Request, res: Response): Promise<void> => {
  try {
    const letter = req.params.letter.toUpperCase();
    const regex = new RegExp(`^Dr\\.\\s${letter}`, 'i');

    const doctors = await Doctor.find(
      { name: { $regex: regex } },
      { photo: 1, name: 1, specialist: 1, location: 1 }
    );

    res.json(doctors);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};

// Fetch doctor by ID
export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
  try {
    const doctor = await Doctor.findById(req.params.id);
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
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching doctor details', error: error.message });
  }
};

// Add one or multiple doctors for a given letter
export const createDoctorForLetter = async (req: Request, res: Response): Promise<void> => {
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

      const newDoctor = new Doctor({
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
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating doctor(s)', error: error.message });
  }
};
