"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteJob = exports.updateJob = exports.createJob = exports.getJobById = exports.searchJobs = void 0;
const job_1 = __importDefault(require("../../models/hospital/job"));
// Search jobs
const searchJobs = async (req, res) => {
    try {
        const { title, city } = req.query;
        const query = {};
        if (title) {
            query.title = { $regex: title.toString(), $options: 'i' };
        }
        if (city) {
            query.location = { $regex: city.toString(), $options: 'i' };
        }
        const jobs = await job_1.default.find(query);
        res.status(200).json({
            count: jobs.length,
            jobs
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.searchJobs = searchJobs;
// Get job by ID
const getJobById = async (req, res) => {
    try {
        const job = await job_1.default.findById(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getJobById = getJobById;
// Create a job
const createJob = async (req, res) => {
    try {
        const job = new job_1.default(req.body);
        const newJob = await job.save();
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.createJob = createJob;
// Update a job
const updateJob = async (req, res) => {
    try {
        const job = await job_1.default.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json(job);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updateJob = updateJob;
// Delete a job
const deleteJob = async (req, res) => {
    try {
        const job = await job_1.default.findByIdAndDelete(req.params.jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.status(200).json({ message: 'Job deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteJob = deleteJob;
