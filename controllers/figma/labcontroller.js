const Lab = require('../../models/figma/labmodel');

// List all available alphabets (excluding J, Q, U, W, X, Y)
exports.getAlphabets = async (req, res) => {
  try {
    const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
    const alphabets = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))
      .filter(letter => !excludedLetters.includes(letter));
    res.json(alphabets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alphabets', error });
  }
};

// Get only lab names by letter
exports.getLabNamesByLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs = await Lab.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1, _id: 1 });
    const labNames = labs.map(lab => ({ id: lab._id, name: lab.name }));
    res.json(labNames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab names', error });
  }
};

// Get labs by letter (full details)
exports.getLabsByLetter = async (req, res) => {
 try {
    const letter = req.params.letter.toUpperCase();
    const labs = await Lab.find({ name: new RegExp(`^${letter}`, 'i') }, { name: 1, _id: 1 });
    const labNames = labs.map(lab => ({ id: lab._id, name: lab.name }));
    res.json(labNames);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab names', error });
  }
};

// Get lab details by ID
exports.getLabDetailsById = async (req, res) => {
  try {
    const id = req.params.id;
    const lab = await Lab.findById(id);
    if (lab) {
      res.json({
        researchArea: lab.researchArea,
        researchers: lab.researchers,
        contact: lab.contact,
        publications: lab.publications,
        createdAt: lab.createdAt,
        updatedAt: lab.updatedAt
      });
    } else {
      res.status(404).json({ message: 'Lab not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab details', error });
  }
};

// Get lab by ID (full details)
exports.getLabById = async (req, res) => {
  try {
    const id = req.params.id;
    const lab = await Lab.findById(id);
    if (lab) {
      res.json(lab);
    } else {
      res.status(404).json({ message: 'Lab not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lab details', error });
  }
};

// Post a new lab (general endpoint)
exports.createLab = async (req, res) => {
  try {
    const { name, researchArea, researchers, contact, publications } = req.body;
    
    // Validate that the lab name starts with an available letter
    const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
    const firstLetter = name.charAt(0).toUpperCase();
    if (excludedLetters.includes(firstLetter)) {
      return res.status(400).json({ message: `Lab name cannot start with ${firstLetter}` });
    }

    const newLab = new Lab({
      name,
      researchArea,
      researchers,
      contact,
      publications
    });

    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab', error });
  }
};

// Post a new lab for a specific letter
exports.createLabForLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const { name, researchArea, researchers, contact, publications } = req.body;

    // Validate that the letter is not excluded
    const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
    if (excludedLetters.includes(letter)) {
      return res.status(400).json({ message: `Cannot create lab for letter ${letter}` });
    }

    // Validate that the lab name starts with the specified letter
    if (!name || !name.toUpperCase().startsWith(letter)) {
      return res.status(400).json({ message: `Lab name must start with the letter ${letter}` });
    }

    const newLab = new Lab({
      name,
      researchArea,
      researchers,
      contact,
      publications
    });

    const savedLab = await newLab.save();
    res.status(201).json(savedLab);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lab for letter', error });
  }
};

// Bulk post labs for a specific letter
exports.bulkCreateLabsForLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const labs = req.body; // Expecting an array of labs

    // Validate that the letter is not excluded
    const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
    if (excludedLetters.includes(letter)) {
      return res.status(400).json({ message: `Cannot create labs for letter ${letter}` });
    }

    // Validate that each lab name starts with the specified letter
    const invalidLabs = labs.filter(lab => !lab.name || !lab.name.toUpperCase().startsWith(letter));
    if (invalidLabs.length > 0) {
      return res.status(400).json({
        message: `All lab names must start with the letter ${letter}`,
        invalidLabs
      });
    }

    // Create lab documents
    const labDocs = labs.map(lab => ({
      name: lab.name,
      researchArea: lab.researchArea,
      researchers: lab.researchers,
      contact: lab.contact,
      publications: lab.publications
    }));

    // Insert all labs into the database
    const savedLabs = await Lab.insertMany(labDocs);
    res.status(201).json(savedLabs);
  } catch (error) {
    res.status(500).json({ message: 'Error bulk creating labs for letter', error });
  }
};

// Update a lab by ID
exports.updateLab = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, researchArea, researchers, contact, publications } = req.body;

    // Validate that the updated lab name starts with an available letter
    if (name) {
      const excludedLetters = ['J', 'Q', 'U', 'W', 'X', 'Y'];
      const firstLetter = name.charAt(0).toUpperCase();
      if (excludedLetters.includes(firstLetter)) {
        return res.status(400).json({ message: `Lab name cannot start with ${firstLetter}` });
      }
    }

    const updatedLab = await Lab.findByIdAndUpdate(
      id,
      { name, researchArea, researchers, contact, publications },
      { new: true, runValidators: true }
    );

    if (updatedLab) {
      res.json(updatedLab);
    } else {
      res.status(404).json({ message: 'Lab not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating lab', error });
  }
};

// Delete a lab by ID
exports.deleteLab = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLab = await Lab.findByIdAndDelete(id);
    if (deletedLab) {
      res.json({ message: 'Lab deleted successfully', deletedLab });
    } else {
      res.status(404).json({ message: 'Lab not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lab', error });
  }
};