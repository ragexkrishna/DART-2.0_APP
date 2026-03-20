import express from "express";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/role.middleware.js";

import {
  getAdminDashboard,
  getStudents,
  getAllAttendance,
  getSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  getTips,
  createTip,
  updateTip,
  deleteTip,
  setActiveTip,
  getFeedbacks,
} from "../controllers/admin.controller.js";

import {
  getAllTickets,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";

const router = express.Router();

router.get("/dashboard",  protect, adminOnly, getAdminDashboard);

router.get("/students",   protect, adminOnly, getStudents);
router.get("/attendance", protect, adminOnly, getAllAttendance);
router.get("/feedbacks",  protect, adminOnly, getFeedbacks);


router.get("/schedules",      protect, adminOnly, getSchedules);
router.post("/schedules",     protect, adminOnly, createSchedule);
router.put("/schedules/:id",  protect, adminOnly, updateSchedule);
router.delete("/schedules/:id", protect, adminOnly, deleteSchedule);

router.get("/tickets",       protect, adminOnly, getAllTickets);
router.patch("/tickets/:id", protect, adminOnly, updateTicketStatus);

router.get("/announcements",         protect, adminOnly, getAnnouncements);
router.post("/announcements",        protect, adminOnly, createAnnouncement);
router.put("/announcements/:id",     protect, adminOnly, updateAnnouncement);
router.delete("/announcements/:id",  protect, adminOnly, deleteAnnouncement);

router.get("/tips",         protect, adminOnly, getTips);
router.post("/tips",        protect, adminOnly, createTip);
router.put("/tips/:id",     protect, adminOnly, updateTip);
router.delete("/tips/:id",  protect, adminOnly, deleteTip);
router.patch("/tips/:id/active", protect, adminOnly, setActiveTip);

export default router;