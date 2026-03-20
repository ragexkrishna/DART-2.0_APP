import axios from "axios";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "dart_workshop_secret_key_2026";

export const login = async (req, res) => {
  const { email, password, rollNumber, role } = req.body;

  try {
    // ADMIN LOGIN FLOW
    if (role === "admin") {
      const adminUser = await User.findOne({ email, role: "admin" });
      
      if (!adminUser) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isMatch = await bcrypt.compare(password, adminUser.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: adminUser._id, role: "admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        name: adminUser.name,
        email: adminUser.email,
        role: "admin",
        token
      });
    }

    // STUDENT LOGIN FLOW
    if (role === "student" || !role) {
      const sheetURL =
        "https://opensheet.elk.sh/1ukomuNdIHHhrmETeZgUNuYuVFYsCG4b-CqdkNw1VTBY/participant_rows";

      const response = await axios.get(sheetURL);
      const participants = response.data;

      const validParticipant = participants.find(
        (u) =>
          u.email?.trim().toLowerCase() === email?.trim().toLowerCase() &&
          u.participant_id?.trim().toUpperCase() === rollNumber?.trim().toUpperCase()
      );

      if (!validParticipant) {
        return res.status(401).json({ message: "Invalid email or roll number" });
      }

      // Upsert this participant into MongoDB so they appear in leaderboard + admin Students
      // We key on email — no password needed since auth is via Google Sheet
      let dbUser = await User.findOne({ email: validParticipant.email.trim().toLowerCase() });
      if (!dbUser) {
        dbUser = await User.create({
          name:       validParticipant.name,
          email:      validParticipant.email.trim().toLowerCase(),
          password:   "SHEET_AUTH_NO_PASSWORD", // not used for login
          role:       "student",
          rollNumber: validParticipant.participant_id,
          branch:     validParticipant.branch || "",
          college:    validParticipant.college || "",
        });
      }

      // Build token using the real Mongo _id so attendance/tickets link correctly
      const token = jwt.sign(
        {
          id:         dbUser._id.toString(),
          email:      dbUser.email,
          name:       dbUser.name,
          rollNumber: validParticipant.participant_id,
          role:       "student",
        },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        name:       dbUser.name,
        email:      dbUser.email,
        rollNumber: validParticipant.participant_id,
        token,
        role:       "student",
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};