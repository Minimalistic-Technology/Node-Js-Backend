import { Request, Response } from 'express';
import Doctor, { IDoctor } from '../../models/hospital/doctormodel';

// GET all alphabets (A-Z)
export const getAlphabets = async (_req: Request, res: Response) => {
  try {
    const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    res.status(200).json(alphabets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alphabets', error });
  }
};

// GET all doctors irrespective of letter - limited fields
export const getAllDoctors = async (_req: Request, res: Response) => {
  try {
    const doctors = await Doctor.find(
      {},
      { photo: 1, name: 1, specialist: 1, location: 1 }
    );
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all doctors', error });
  }
};

// GET doctors by letter (Dr. X...) - limited fields
export const getDoctorsByLetter = async (req: Request, res: Response) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const regex = new RegExp(`^Dr\\.\\s${letter}`, 'i');

    const doctors = await Doctor.find(
      { name: { $regex: regex } },
      { photo: 1, name: 1, specialist: 1, location: 1 }
    );

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

// GET doctor details by ID
export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
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
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor details', error });
  }
};

// POST new doctor(s) under a letter
export const createDoctorForLetter = async (req: Request, res: Response) => {
  try {
    const letter = req.params.letter.toUpperCase();
    let doctors = Array.isArray(req.body) ? req.body : [req.body];

    const savedDoctors: IDoctor[] = [];

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

      const doctor = new Doctor({
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
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor(s)', error });
  }
};

// POST new doctor(s) irrespective of letter
export const createDoctors = async (req: Request, res: Response) => {
  try {
    let doctors = Array.isArray(req.body) ? req.body : [req.body];

    const savedDoctors: IDoctor[] = [];

    for (const doctorData of doctors) {
      const { name, specialist, location, photo, qualifications, experience, contact, bio } = doctorData;

      if (!name || !specialist || !location || !photo) {
        return res.status(400).json({
          message: 'Each doctor must include name, specialist, location, and photo',
          providedData: { name, specialist, location, photo }
        });
      }

      const doctor = new Doctor({
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
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor(s)', error });
  }
};

// DELETE all doctors irrespective of letter
export const deleteAllDoctors = async (_req: Request, res: Response) => {
  try {
    const result = await Doctor.deleteMany({});
    res.status(200).json({ 
      message: 'All doctors deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting all doctors', error });
  }
};