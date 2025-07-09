import Log from "../models/Log.js";

export const getRecentLogs = async (req, res) => {
  const logs = await Log.find().populate("user", "username").sort({ createdAt: -1 }).limit(20);
  res.json(logs);
};
