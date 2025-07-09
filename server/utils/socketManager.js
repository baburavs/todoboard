// 📁 server/utils/socketManager.js
import Task from "../models/Task.js";

let ioInstance;

export const setupSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    console.log("🧠 New WebSocket connection");

    // ✅ Emit test activity log on connect
    socket.emit("activity", {
      message: " Test WebSocket log connected",
      timestamp: new Date(),
    });

    // Trigger full task refresh
    socket.on("task:update", async () => {
      const tasks = await Task.find().populate("assignedUser", "email");
      io.emit("task:refresh", tasks);
    });

    // Forward manual log events
    socket.on("log", (activity) => {
      io.emit("activity", { ...activity, timestamp: new Date() });
    });
  });
};

// ✅ Helper function to emit activity from anywhere
export const emitActivity = (activity) => {
  if (ioInstance) {
    ioInstance.emit("activity", {
      ...activity,
      timestamp: new Date(),
    });
  }
};
