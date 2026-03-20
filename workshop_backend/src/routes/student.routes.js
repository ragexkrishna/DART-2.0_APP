import express from "express";
import {
  getStudentDashboard,
  getMyAttendance,
  getMyTickets,
  getSchedule,
  getLeaderboardStudents,
  getLeaderboardAttendance,
  submitFeedback,
  getLeaderboardFeedbacks,
  getMyFeedback,
} from "../controllers/student.controller.js";



import { createTicket } from "../controllers/ticket.controller.js";
import { getAnnouncements, getTips } from "../controllers/admin.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

// All student routes require auth
router.use(protect);

router.get("/dashboard",  getStudentDashboard);
router.get("/attendance", getMyAttendance);
router.get("/tickets",    getMyTickets);
router.post("/tickets",   createTicket);
router.get("/schedule",   getSchedule);

// Leaderboard data (accessible by any authenticated user)
router.get("/leaderboard-students",   getLeaderboardStudents);
router.get("/leaderboard-attendance", getLeaderboardAttendance);
router.get("/leaderboard-feedbacks",  getLeaderboardFeedbacks);

// Feedback
router.post("/feedback", submitFeedback);
router.get("/feedback",  getMyFeedback);



// Announcements (read-only for students)
router.get("/announcements", getAnnouncements);

// Tips (read-only for students)
router.get("/tips", getTips);

export default router;