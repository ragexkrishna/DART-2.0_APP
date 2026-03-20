import express from "express"

import protect from "../middleware/auth.middleware.js"

import {
    getWorkshops,
    markAttendance,
    submitFeedback
} from "../controllers/workshop.controller.js"

const router = express.Router()

router.get("/", protect, getWorkshops)

router.post("/attendance", protect, markAttendance)

router.post("/feedback", protect, submitFeedback)

export default router