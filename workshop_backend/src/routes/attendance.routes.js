import express from "express";
import {
  markAttendance,
  getAttendance,
} from "../controllers/attendance.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, adminOnly, markAttendance);
router.get("/", protect, adminOnly, getAttendance);

export default router;