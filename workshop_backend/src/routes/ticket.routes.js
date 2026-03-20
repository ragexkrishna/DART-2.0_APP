import express from "express";
import {
  createTicket,
  getAllTickets,
  updateTicketStatus,
} from "../controllers/ticket.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

router.post("/", protect, createTicket);
router.get("/", protect, adminOnly, getAllTickets);
router.patch("/:id", protect, adminOnly, updateTicketStatus);

export default router;