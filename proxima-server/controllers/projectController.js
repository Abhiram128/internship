const mongoose = require("mongoose");
const Project = require("../models/projectModel");
const Task = require("../models/taskModel");

// Get all projects
const getAllProjects = async (req, res) => {
  const user_id = req.user._id;
  const projects = await Project.find({ user_id }).sort({ createdAt: -1 });

  res.status(200).json(projects);
};

// Get a single project
const getSingleProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid project id!" });
  }

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ error: "No project found!" });
  }

  res.status(200).json(project);
};

// Post a new project
const postProject = async (req, res) => {
  const { title, tech, budget, duration, manager, dev } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!tech) emptyFields.push("tech");
  if (!budget) emptyFields.push("budget");
  if (!duration) emptyFields.push("duration");
  if (!manager) emptyFields.push("manager");
  if (!dev) emptyFields.push("dev");

  if (emptyFields.length >= 1) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields!", emptyFields });
  }

  try {
    const user_id = req.user._id;
    const project = await Project.create({ ...req.body, user_id });
    res.status(200).json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a project
const deleteProject = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid project id" });
  }

  const project = await Project.findOneAndDelete({ _id: id });

  if (!project) {
    return res.status(400).json({ message: "No project found!" });
  }

  res.status(200).json(project);
};

// Update a project
const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, tech, budget, duration, manager, dev } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!tech) emptyFields.push("tech");
  if (!budget) emptyFields.push("budget");
  if (!duration) emptyFields.push("duration");
  if (!manager) emptyFields.push("manager");
  if (!dev) emptyFields.push("dev");

  if (emptyFields.length >= 1) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields!", emptyFields });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "Invalid project id" });
  }

  const project = await Project.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });

  if (!project) {
    return res.status(400).json({ message: "No project found!" });
  }

  res.status(200).json(project);
};

// Get all tasks for a project
const getAllTasks = async (req, res) => {
  const { project_id } = req.params;

  try {
    const tasks = await Task.find({ project_id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
};

// Add a new task to a project
const addTask = async (req, res) => {
  const { project_id } = req.params;
  const { task_description } = req.body;

  if (!project_id || !task_description) {
    return res.status(400).json({ error: "Please provide project_id and task_description" });
  }

  try {
    const task = await Task.create({ project_id, task_description, completed: false });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error adding task" });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { task_id } = req.params;

  if (!task_id) {
    return res.status(400).json({ error: "Please provide task_id" });
  }

  try {
    const task = await Task.findOneAndDelete({ _id: task_id });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error deleting task" });
  }
};

// Complete a task
const completeTask = async (req, res) => {
  const { task_id } = req.params;

  if (!task_id) {
    return res.status(400).json({ error: "Please provide task_id" });
  }

  try {
    const task = await Task.findOneAndUpdate({ _id: task_id }, { completed: true }, { new: true });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Error completing task" });
  }
};

// Retrieve tasks
const retrieveTasks = async (req, res) => {
  const { project_id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(project_id)) {
    return res.status(404).json({ message: "Invalid project id" });
  }

  try {
    const tasks = await Task.find({ project_id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving tasks" });
  }
};

module.exports = {
  getAllTasks,
  addTask,
  deleteTask,
  completeTask,
  retrieveTasks,
  postProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  updateProject,
};
