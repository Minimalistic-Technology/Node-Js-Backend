import { Request, Response } from 'express';
import Job from '../../models/figma/job';

// Search jobs by title and/or city (case-insensitive, partial match)
export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, city } = req.query;

    const query: Record<string, any> = {};

    if (title) {
      query.title = { $regex: new RegExp(title as string, 'i') };
    }

    if (city) {
      query.location = { $regex: new RegExp(city as string, 'i') };
    }

    // Note: radius is ignored, as it requires geo-location implementation.

    const jobs = await Job.find(query);
    res.status(200).json({
      count: jobs.length,
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(200).json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new job
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = new Job(req.body);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a job
export const updateJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const updatedJob = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
    if (!updatedJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(200).json(updatedJob);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const deletedJob = await Job.findByIdAndDelete(req.params.jobId);
    if (!deletedJob) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
