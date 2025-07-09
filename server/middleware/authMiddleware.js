// 📁 middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("email username");

    if (!user) return res.status(401).json({ error: "User not found" });

    // ✅ Explicitly attach username and email
    req.user = {
      id: user._id,
      email: user.email,
      username: user.username,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
