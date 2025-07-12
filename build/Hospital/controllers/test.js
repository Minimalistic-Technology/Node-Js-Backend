"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendTestsByLetter = exports.deleteTestById = exports.updateTestById = exports.appendToTestById = exports.addMultipleTests = exports.getTestsByLetter = void 0;
const test_1 = require("../models/test");
// Get tests by first letter
const getTestsByLetter = async (req, res) => {
    try {
        const { letter } = req.params;
        if (!letter || letter.length !== 1 || !/[A-Z]/i.test(letter)) {
            res.status(400).json({ message: 'Invalid letter' });
            return;
        }
        const tests = await test_1.TestModel.find({ firstLetter: letter.toUpperCase() }).exec();
        res.json(tests);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tests', error });
    }
};
exports.getTestsByLetter = getTestsByLetter;
// Post multiple tests at once
const addMultipleTests = async (req, res) => {
    try {
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const formatted = data.map(item => ({
            ...item,
            firstLetter: item.name?.charAt(0).toUpperCase() || 'Z',
        }));
        const inserted = await test_1.TestModel.insertMany(formatted);
        res.status(201).json(inserted);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding tests', error });
    }
};
exports.addMultipleTests = addMultipleTests;
// Post additional info to an existing test by ID
const appendToTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const test = await test_1.TestModel.findByIdAndUpdate(id, { $set: update }, { new: true });
        if (!test) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.json(test);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating test', error });
    }
};
exports.appendToTestById = appendToTestById;
// Update test by ID
const updateTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const update = req.body;
        const updated = await test_1.TestModel.findByIdAndUpdate(id, update, { new: true });
        if (!updated) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating test', error });
    }
};
exports.updateTestById = updateTestById;
// Delete test by ID
const deleteTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await test_1.TestModel.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ message: 'Test not found' });
            return;
        }
        res.json({ message: 'Test deleted', id: deleted._id });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting test', error });
    }
};
exports.deleteTestById = deleteTestById;
// Append one or more tests under a specific starting letter
const appendTestsByLetter = async (req, res) => {
    try {
        const { letter } = req.params;
        if (!letter || letter.length !== 1 || !/[A-Z]/i.test(letter)) {
            res.status(400).json({ message: 'Invalid letter' });
            return;
        }
        const data = Array.isArray(req.body) ? req.body : [req.body];
        const formatted = data.map(item => ({
            ...item,
            firstLetter: letter.toUpperCase(),
        }));
        const inserted = await test_1.TestModel.insertMany(formatted);
        res.status(201).json({ message: `Appended tests to letter ${letter.toUpperCase()}`, inserted });
    }
    catch (error) {
        res.status(500).json({ message: 'Error appending tests', error });
    }
};
exports.appendTestsByLetter = appendTestsByLetter;
