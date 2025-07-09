import express from "express";
import { getRecentLogs } from "../controllers/logController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getRecentLogs);

export default router;
