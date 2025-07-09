import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    const token = createToken(user);
    res.status(201).json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    res.status(400).json({ error: "Username already exists." });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }
    const token = createToken(user);
    res.status(200).json({ user: { id: user._id, username: user.username }, token });
  } catch {
    res.status(500).json({ error: "Login failed." });
  }
};
