import { RequestHandler } from 'express';
import { TaskModel } from '../models/task';

// Create Task
export const createTask: RequestHandler = async (req, res) => {
  try {
    const task = await TaskModel.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
};

// Get All Tasks
export const getTasks: RequestHandler = async (_req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

// Get Task by ID
export const getTaskById: RequestHandler = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching task' });
  }
};

// Update Task
export const updateTask: RequestHandler = async (req, res) => {
  try {
    const updated = await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update task' });
  }
};

// Delete Task
export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const deleted = await TaskModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};
