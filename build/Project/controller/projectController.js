"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjects = exports.createProject = void 0;
const Project_1 = __importDefault(require("../../models/Project"));
// Create Project
const createProject = async (req, res) => {
    try {
        const project = new Project_1.default(req.body);
        await project.save();
        res.status(201).json(project);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to create project' });
    }
};
exports.createProject = createProject;
const getProjects = async (req, res) => {
    try {
        const { category } = req.query;
        let projects;
        if (!category || category === 'All') {
            projects = await Project_1.default.find();
        }
        else {
            projects = await Project_1.default.find({ category });
        }
        res.json(projects);
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to fetch projects' });
    }
};
exports.getProjects = getProjects;
// Update Project
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Project_1.default.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to update project' });
    }
};
exports.updateProject = updateProject;
// Delete Project
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Project_1.default.findByIdAndDelete(id);
        if (!deleted) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({ message: 'Project deleted successfully' });
    }
    catch (err) {
        res.status(400).json({ error: 'Failed to delete project' });
    }
};
exports.deleteProject = deleteProject;
