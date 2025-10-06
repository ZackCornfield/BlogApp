import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getRecentActivities,
} from "../controllers/userController";
import authenticateToken from "../middleware/authMiddleware";

const router = express.Router();

// Get user profile
router.get("/", authenticateToken, getUserProfile);

// Update user profile
router.put("/", authenticateToken, updateUserProfile);

router.get("/recent-activities", authenticateToken, getRecentActivities);

export default router;
