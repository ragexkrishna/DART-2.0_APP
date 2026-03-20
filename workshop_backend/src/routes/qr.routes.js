import express from "express"
import { generateWorkshopQR } from "../controllers/qr.controller.js"
import protect from "../middleware/auth.middleware.js"
import adminOnly from "../middleware/role.middleware.js"

const router = express.Router()

router.get("/generate/:workshopId", protect, adminOnly, generateWorkshopQR)

export default router