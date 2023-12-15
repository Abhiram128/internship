const express = require("express");
const {
  postProject,
  getAllProjects,
  getSingleProject,
  deleteProject,
  updateProject,
  addTask,
  deleteTask,
  completeTask,
  retrieveTasks,
} = require("../controllers/projectController");
const requireAuth = require("../middlewares/requireAuth");

// Router
const router = express.Router();

router.use(requireAuth);

// GET all projects
router.get("/", getAllProjects);

// GET a single project
router.get("/:id", getSingleProject);

// POST a new project
router.post("/", postProject);

// DELETE a project
router.delete("/:id", deleteProject);

// PATCH a project
router.patch("/:id", updateProject);

// Task-related routes
router.post("/:project_id/tasks", addTask);
router.delete("/:project_id/tasks/:task_id", deleteTask);
router.patch("/:project_id/tasks/:task_id/complete", completeTask);
router.get("/:project_id/tasks", retrieveTasks);

module.exports = router;
