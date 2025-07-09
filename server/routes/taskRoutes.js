import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";
import { emitActivity } from "../utils/socketManager.js";

const router = express.Router();

// gogiet all tasks
router.get("/", protect, async (req, res) => {
const tasks = await Task.find();
res.json(tasks);
});

// create a new task
router.post("/", protect, async (req, res) => {
const task = await Task.create({ ...req.body, assignedUser: req.user.id });
const username = req.user.name || req.user.email || "User";

emitActivity({
type: "Task Created",
message: `📝 Task '${task.title}' was created by ${username}`,
});

res.status(201).json(task);
});

// Update task//////////////////////////////////////
router.put("/:id", protect, async (req, res) => {
const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
new: true,
});

emitActivity({
type: "Task Updated",
message: `🔁 Task '${updated.title}' moved to ${updated.status}`,
});

res.json(updated);
});
// Delete task +++++++++++++++++++++_____________________
router.delete("/:id", protect, async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task) {
    emitActivity({
      type: "Task Deleted",
      message: `🗑️ Task '${task.title}' was deleted by ${req.user.email}`,
    });
    res.json({ message: "Task deleted" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});


export default router;