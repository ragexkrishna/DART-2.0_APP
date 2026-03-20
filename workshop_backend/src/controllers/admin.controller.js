import User from "../models/User.js";
import Schedule from "../models/Schedule.js";
import Attendance from "../models/Attendance.js";
import Announcement from "../models/Announcement.js";
import Tip from "../models/Tip.js";
import Feedback from "../models/Feedback.js";
import { getAllAttendanceFromSheets } from "../utils/googleSheets.js";

/* ── Dashboard ───────────────────────────── */
export const getAdminDashboard = (req, res) => {
  res.json({ message: "Admin Dashboard Data" });
};

/* ── Students ────────────────────────────── */
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("name email rollNumber createdAt")
      .lean();

    res.json(
      students.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        email: s.email,
        rollNumber: s.rollNumber,
        createdAt: s.createdAt,
      }))
    );
  } catch (error) {
    console.error("Failed to load students from database:", error.message);
    res.status(500).json({ error: "Failed to load students list." });
  }
};

/* ── Attendance (admin overview) ───────────────────────────── */

export const getAllAttendance = async (req, res) => {
  try {
    const records = await getAllAttendanceFromSheets();
    res.json(records);
  } catch (error) {
    console.error("Failed to fetch Google Sheets attendance for admin:", error.message);
    res.status(500).json({ error: "Failed to fetch attendance records." });
  }
};

/* ── Schedules ───────────────────────────── */
export const getSchedules = async (req, res) => {
  const data = await Schedule.find().lean();
  res.json(data);
};

export const createSchedule = async (req, res) => {
  const session = await Schedule.create(req.body);
  res.json(session);
};

export const updateSchedule = async (req, res) => {
  const session = await Schedule.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!session) {
    return res.status(404).json({ error: "Session not found" });
  }

  res.json(session);
};

export const deleteSchedule = async (req, res) => {
  await Schedule.findByIdAndDelete(req.params.id);
  res.json({ message: "Session deleted" });
};

/* ── Announcements ───────────────────────────── */
export const getAnnouncements = async (req, res) => {
  const list = await Announcement.find().sort({ createdAt: -1 }).lean();
  res.json(list.map((a) => ({ ...a, id: a._id.toString() })));
};

export const createAnnouncement = async (req, res) => {
  const { title, description, type } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const ann = await Announcement.create({
    title,
    description: description || "",
    type: type || "general",
    createdBy: req.user?.name || "Admin",
  });
  res.status(201).json({ ...ann.toJSON(), id: ann._id.toString() });
};

export const updateAnnouncement = async (req, res) => {
  const ann = await Announcement.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!ann) return res.status(404).json({ error: "Announcement not found" });
  res.json({ ...ann.toJSON(), id: ann._id.toString() });
};

export const deleteAnnouncement = async (req, res) => {
  await Announcement.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

/* ── Tips ────────────────────────────────────── */
export const getTips = async (req, res) => {
  const tips = await Tip.find().sort({ createdAt: -1 }).lean();
  res.json(tips.map((t) => ({ ...t, id: t._id.toString() })));
};

export const createTip = async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  const tip = await Tip.create({ text, active: false });
  res.status(201).json({ ...tip.toJSON(), id: tip._id.toString() });
};

export const updateTip = async (req, res) => {
  const tip = await Tip.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  if (!tip) return res.status(404).json({ error: "Tip not found" });
  res.json({ ...tip.toJSON(), id: tip._id.toString() });
};

export const deleteTip = async (req, res) => {
  await Tip.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

export const setActiveTip = async (req, res) => {
  const { id } = req.params;
  // Deactivate all others first
  await Tip.updateMany({}, { active: false });
  const tip = await Tip.findByIdAndUpdate(id, { active: true }, { new: true });
  res.json(tip);
};

export const getFeedbacks = async (req, res) => {
  try {
    const list = await Feedback.find().sort({ createdAt: -1 }).lean();
    res.json(list.map(f => ({ ...f, id: f._id.toString() })));
  } catch (error) {
    console.error("Failed to fetch feedbacks for admin:", error.message);
    res.status(500).json({ error: "Failed to fetch feedback records." });
  }
};