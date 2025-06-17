"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const job_1 = __importDefault(require("../../controllers/hospital/job"));
const router = (0, express_1.Router)();
// Route to search/filter jobs
router.get('/job', job_1.default.searchJobs);
// Route to get a job by ID
router.get('/job/:jobId', job_1.default.getJobById);
// Route to create a new job
router.post('/job', job_1.default.createJob);
// Route to update an existing job by ID
router.put('/job/:jobId', job_1.default.updateJob);
// Route to delete a job by ID
router.delete('/job/:jobId', job_1.default.deleteJob);
exports.default = router;
