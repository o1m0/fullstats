const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const { requireLogin } = require("../middleware/auth");

router.get("/tasks", requireLogin, taskController.renderTasks);
router.post("/tasks", requireLogin, taskController.saveTasksProfile);

module.exports = router;
