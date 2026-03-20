import express from "express"
import dotenv from "dotenv"
import cors from "cors"

import connectDB from "./config/db.js"

import authRoutes from "./routes/auth.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import workshopRoutes from "./routes/workshop.routes.js"
import qrRoutes from "./routes/qr.routes.js"
import studentRoutes from "./routes/student.routes.js";

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/workshops", workshopRoutes)
app.use("/api/qr", qrRoutes)
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})