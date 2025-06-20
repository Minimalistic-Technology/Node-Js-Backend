import { Request, Response } from 'express';
import Job, { IJob } from '../models/job';

// Search jobs
export const searchJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, city } = req.query;

    const query: any = {};

    if (title) {
      query.title = { $regex: title.toString(), $options: 'i' };
    }

    if (city) {
      query.location = { $regex: city.toString(), $options: 'i' };
    }

    const jobs: IJob[] = await Job.find(query);

    res.status(200).json({
      count: jobs.length,
      jobs
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get job by ID
export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job: IJob | null = await Job.findById(req.params.jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(200).json(job);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a job
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
    const job: IJob | null = await Job.findByIdAndUpdate(
      req.params.jobId,
      req.body,
      { new: true }
    );
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(200).json(job);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a job
export const deleteJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const job: IJob | null = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) {
      res.status(404).json({ message: 'Job not found' });
      return;
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
