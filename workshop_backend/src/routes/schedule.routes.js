import express from "express";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/dashboard", protect, (req, res) => {
  res.json({ message: "Student Dashboard" });
});

export default router;