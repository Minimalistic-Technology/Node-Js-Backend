import { Request, Response } from 'express';
import Project, { IProject } from '../../models/Project';

// Create Project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = new Project(req.body as IProject);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create project' });
  }
};

export const getProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category } = req.query;
    let projects;

    if (!category || category === 'All') {
      projects = await Project.find();
    } else {
      projects = await Project.find({ category });
    }

    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Update Project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update project' });
  }
};

// Delete Project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete project' });
  }
};
