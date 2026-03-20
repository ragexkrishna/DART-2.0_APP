import Attendance from "../models/Attendance.js";

export const markAttendance = async (req, res) => {
  const record = await Attendance.create({
    student: req.body.student_id,
    date:    req.body.date,
    status:  req.body.status,
  });
  res.json(record);
};

export const getAttendance = async (req, res) => {
  const data = await Attendance.find().lean();
  res.json(data.map((r) => ({
    _id:        r._id,
    student_id: r.student?.toString() || "",
    date:       r.date,
    status:     r.status,
  })));
};

export const markBulkAttendance = async (req, res) => {
  const records = req.body; // [{ student_id, date, status }]
  const docs = records.map((r) => ({
    student: r.student_id,
    date:    r.date,
    status:  r.status,
  }));
  await Attendance.insertMany(docs);
  res.json({ message: "Attendance saved successfully" });
};