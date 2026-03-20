import Attendance from "../models/Attendance.js";
import Ticket     from "../models/Ticket.js";
import Schedule   from "../models/Schedule.js";
import User       from "../models/User.js";
import Feedback   from "../models/Feedback.js";
import { getAggregatedAttendance, getAllAttendanceFromSheets } from "../utils/googleSheets.js";

export const getStudentDashboard = (req, res) => {
  res.json({ message: "Student Dashboard" });
};

export const getMyAttendance = async (req, res) => {
  try {
    const data = await getAggregatedAttendance(req.user.email, req.user.rollNumber);
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch Google Sheets attendance:", error.message);
    res.status(500).json({ error: "Failed to fetch attendance data." });
  }
};


export const getMyTickets = async (req, res) => {
  const tickets = await Ticket.find({ student_id: req.user.id }).lean();
  res.json(tickets.map((t) => ({
    ...t,
    id:         t._id.toString(),
  })));
};

export const getSchedule = async (req, res) => {
  const schedule = await Schedule.find().lean();
  res.json(schedule);
};

/* Leaderboard data — accessible by students */
export const getLeaderboardStudents = async (req, res) => {
  const students = await User.find({ role: "student" }).select("name email").lean();
  res.json(students);
};

export const getLeaderboardAttendance = async (req, res) => {
  try {
    const data = await getAllAttendanceFromSheets();
    res.json(data);
  } catch (error) {
    console.error("Failed to fetch Google Sheets leaderboard attendance:", error.message);
    res.status(500).json({ error: "Failed to fetch leaderboard data." });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { rating, text } = req.body;
    const studentId = req.user.rollNumber || req.user.id;
    const studentName = req.user.name;

    const existing = await Feedback.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ error: "Feedback already submitted." });
    }

    const feedback = await Feedback.create({
      studentId,
      studentName,
      rating,
      text,
    });


    res.status(201).json(feedback);
  } catch (error) {
    console.error("Feedback submission failed:", error.message);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
};

export const getLeaderboardFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().select("studentId rating track").lean();
    res.json(feedbacks);
  } catch (error) {
    console.error("Failed to fetch leaderboard feedbacks:", error.message);
    res.status(500).json({ error: "Failed to fetch leaderboard data." });
  }
};

export const getMyFeedback = async (req, res) => {
  try {
    const studentId = req.user.rollNumber || req.user.id;
    const feedback = await Feedback.findOne({ studentId }).lean();
    res.json(feedback || null);
  } catch (error) {
    console.error("Failed to fetch student feedback:", error.message);
    res.status(500).json({ error: "Failed to fetch feedback entry." });
  }
};