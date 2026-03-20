import express from "express";
import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";
import {
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from "../controllers/admin.controller.js";
import { getSchedule } from "../controllers/student.controller.js";

const router = express.Router();

// Student: read-only access to schedule
router.get("/", protect, getSchedule);

// Admin: full CRUD
router.get("/admin", protect, adminOnly, getSchedules);
router.post("/", protect, adminOnly, createSchedule);
router.put("/:id", protect, adminOnly, updateSchedule);
router.delete("/:id", protect, adminOnly, deleteSchedule);

export default router;