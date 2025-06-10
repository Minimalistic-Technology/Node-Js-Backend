const Job = require('../../models/figma/job');

exports.searchJobs = async (req, res) => {
  try {
    const { title, city, radius } = req.query;

    // Build the query object
    const query = {};

    // Match title (case-insensitive)
    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    // Match location (case-insensitive, partial match for city)
    if (city) {
      query.location = { $regex: city, $options: 'i' };
    }

    // Note: Radius is not implemented here as it requires geolocation data and distance calculation.
    // For now, we'll ignore the radius and just filter by title and city.

    const jobs = await Job.find(query);
    res.status(200).json({
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = new Job(req.body);
    const newJob = await job.save();
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};