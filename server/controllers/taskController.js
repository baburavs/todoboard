import Task from "../models/Task.js";
import Log from "../models/Log.js";
import User from "../models/User.js";

export const getTasks = async (req, res) => {
  const tasks = await Task.find().populate("assignedUser", "username");
  res.json(tasks);
};

export const createTask = async (req, res) => {
  const { title, description, status, priority } = req.body;
  if (["To Do", "In Progress", "Done"].includes(title))
    return res.status(400).json({ error: "Task title cannot be a column name" });

  const exists = await Task.findOne({ title });
  if (exists) return res.status(400).json({ error: "Task title must be unique" });

  const task = await Task.create({ title, description, status, priority });
  await Log.create({ action: `Created task "${title}"`, user: req.user.id });
  res.status(201).json(task);
};

export const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  const isConflict = new Date(req.body.updatedAt) < task.updatedAt;
  if (isConflict) {
    return res.status(409).json({
      error: "Conflict detected",
      existing: task,
      incoming: req.body,
    });
  }

  Object.assign(task, req.body);
  task.updatedAt = Date.now();
  await task.save();
  await Log.create({ action: `Updated task "${task.title}"`, user: req.user.id });

  res.json(task);
};

export const deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (task)
    await Log.create({ action: `Deleted task "${task.title}"`, user: req.user.id });
  res.status(204).end();
};

export const smartAssign = async (req, res) => {
  const users = await User.find();
  const userTaskCounts = await Promise.all(
    users.map(async (user) => {
      const count = await Task.countDocuments({
        assignedUser: user._id,
        status: { $in: ["To Do", "In Progress"] },
      });
      return { user, count };
    })
  );

  const leastBusy = userTaskCounts.sort((a, b) => a.count - b.count)[0];
  const task = await Task.findById(req.params.id);
  task.assignedUser = leastBusy.user._id;
  await task.save();

  await Log.create({
    action: `Smart-assigned "${task.title}" to ${leastBusy.user.username}`,
    user: req.user.id,
  });

  res.json(task);
};
