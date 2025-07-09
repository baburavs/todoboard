import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  assignedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: [ "To Do", "In Progress", "Done"],
    default: "To Do", },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Task", taskSchema);
