const Disease = require('../../models/figma/Disease'); 
const Alphabet = require('../../models/figma/alphabet');
exports.getAlphabets = async (req, res) => {
  try {
    const alphabets = await Disease.distinct('letter');
    res.status(200).json({
      count: alphabets.length,
      alphabets
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new alphabet
exports.createAlphabet = async (req, res) => {
  try {
    const { letter } = req.body;
    const validLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'];
    
    if (!validLetters.includes(letter.toUpperCase())) {
      return res.status(400).json({ message: 'Invalid letter' });
    }

    const alphabet = new Alphabet({ letter: letter.toUpperCase() });
    const newAlphabet = await alphabet.save();
    res.status(201).json(newAlphabet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch diseases by letter
exports.getDiseasesByLetter = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const alphabet = await Alphabet.findOne({ letter });

    if (!alphabet) {
      return res.status(404).json({ message: `Alphabet ${letter} not found` });
    }

    const diseases = await Disease.find({ alphabet: alphabet._id });
    res.status(200).json({
      count: diseases.length,
      diseases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST Method 1: Create a single disease for an alphabet
exports.createDisease = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const { name, see } = req.body;

    const alphabet = await Alphabet.findOne({ letter });
    if (!alphabet) {
      return res.status(404).json({ message: `Alphabet ${letter} not found` });
    }

    const disease = new Disease({ alphabet: alphabet._id, name, see });
    const newDisease = await disease.save();
    res.status(201).json(newDisease);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// POST Method 2: Create multiple diseases for an alphabet in bulk
exports.createDiseasesBulk = async (req, res) => {
  try {
    const letter = req.params.letter.toUpperCase();
    const diseases = req.body.diseases; // Expecting an array of { name, see }

    if (!Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({ message: 'Invalid input: diseases must be a non-empty array' });
    }

    const alphabet = await Alphabet.findOne({ letter });
    if (!alphabet) {
      return res.status(404).json({ message: `Alphabet ${letter} not found` });
    }

    const diseaseDocs = diseases.map(d => ({
      alphabet: alphabet._id,
      name: d.name,
      see: d.see || null
    }));

    const newDiseases = await Disease.insertMany(diseaseDocs);
    res.status(201).json({
      count: newDiseases.length,
      diseases: newDiseases
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Fetch a specific disease by ID
exports.getDiseaseById = async (req, res) => {
  try {
    const disease = await Disease.findById(req.params.diseaseId).populate('alphabet');
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json(disease);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a disease by ID
exports.updateDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndUpdate(req.params.diseaseId, req.body, { new: true }).populate('alphabet');
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json(disease);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a disease by ID
exports.deleteDisease = async (req, res) => {
  try {
    const disease = await Disease.findByIdAndDelete(req.params.diseaseId);
    if (!disease) {
      return res.status(404).json({ message: 'Disease not found' });
    }
    res.status(200).json({ message: 'Disease deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
