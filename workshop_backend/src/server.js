import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import connectDB from "./config/db.js"

import authRoutes      from "./routes/auth.routes.js"
import adminRoutes     from "./routes/admin.routes.js"
import workshopRoutes  from "./routes/workshop.routes.js"
import qrRoutes        from "./routes/qr.routes.js"
import studentRoutes   from "./routes/student.routes.js"
import scheduleRoutes  from "./routes/schedule.routes.js"
import attendanceRoutes from "./routes/attendance.routes.js"
import ticketRoutes    from "./routes/ticket.routes.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth",       authRoutes)
app.use("/api/admin",      adminRoutes)
app.use("/api/workshops",  workshopRoutes)
app.use("/api/qr",         qrRoutes)
app.use("/api/student",    studentRoutes)
app.use("/api/schedule",   scheduleRoutes)
app.use("/api/attendance", attendanceRoutes)
app.use("/api/tickets",    ticketRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})