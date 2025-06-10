const Doctor = require('../../models/figma/doctormodel');

// List all available alphabets (excluding J, Q, U, W, X, Y)
exports.getAlphabets = async (req, res) => {
  try {
    const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
    res.json(alphabets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alphabets', error });
  }
};

// Get doctors by letter (only photo, name, specialist, location)
exports.getDoctorsByLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase(); // get letter from URL param and make uppercase

    // Use a regex to match doctors whose name starts with "Dr. " + the letter
    // ^Dr\. <letter> means "Dr. " followed immediately by the letter
    const regex = new RegExp(`^Dr\\.\\s${letter}`, 'i'); // case-insensitive

    const doctors = await Doctor.find(
      { name: { $regex: regex } }, // filter by regex on name
      { photo: 1, name: 1, specialist: 1, location: 1, _id: 1 }
    );

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error });
  }
};

// Get doctor details by ID
exports.getDoctorById = async (req, res) => {
  try {
    const id = req.params.id;
    const doctor = await Doctor.findById(id);
    if (doctor) {
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
        organization: "Minimalistic"
      });
    } else {
      res.status(404).json({ message: 'Doctor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctor details', error });
  }
};

// Post a new doctor for a specific letter
exports.createDoctorForLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    let doctors = req.body;

    // Ensure input is always an array
    if (!Array.isArray(doctors)) {
      doctors = [doctors];
    }

    const savedDoctors = [];

    for (let doctor of doctors) {
      const { name, specialist, location, photo, qualifications, experience, contact, bio } = doctor;

      // Check if name exists and starts with the specified letter
      if (!name) {
        return res.status(400).json({ 
          message: `Each doctor name must start with the letter "${letter}"`,
          providedName: name || 'No name provided'
        });
      }

      // Check required fields
      if (!specialist || !location || !photo) {
        return res.status(400).json({ 
          message: 'Each doctor must have specialist, location, and photo'
        });
      }

      const newDoctor = new Doctor({
        name,
        specialist,
        location,
        photo,
        qualifications: qualifications || [],
        experience: experience || '',
        contact: contact || { email: '', phone: '' },
        bio: bio || ''
      });

      const saved = await newDoctor.save();
      savedDoctors.push(saved);
    }

    res.status(201).json(savedDoctors);
  } catch (error) {
    res.status(500).json({ message: 'Error creating doctor(s)', error });
  }
};
