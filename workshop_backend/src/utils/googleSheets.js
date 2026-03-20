import axios from "axios";
import User from "../models/User.js";

const SHEET_ID = "1a7Z0U1XhYJHlmoBTQQc1pcFTScKvJTexCRZPfb98DVE";
const TOTAL_DAYS = 7;
const START_DATE = new Date("2026-03-20");

/**
 * Fetches attendance for a specific student across all day sheets.
 */
export const getAggregatedAttendance = async (studentEmail, studentRoll) => {
  const promises = [];
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    promises.push(
      axios.get(`https://opensheet.elk.sh/${SHEET_ID}/DAY-${i}`)
        .then(res => ({ day: i, data: res.data }))
        .catch(() => ({ day: i, data: [] }))
    );
  }

  const results = await Promise.all(promises);
  const attendance = [];

  results.forEach(({ day, data }) => {
    if (!Array.isArray(data)) return;

    // Find record for this student by Email or Roll Number
    const record = data.find(r => 
      (studentEmail && r.Email?.toLowerCase() === studentEmail.toLowerCase()) || 
      (studentRoll && String(r["Roll Number"]) === String(studentRoll))
    );

    if (record) {
      const date = new Date(START_DATE);
      date.setUTCDate(START_DATE.getUTCDate() + (day - 1));
      
      attendance.push({
        day: `Day ${day}`,
        date: date.toISOString().split('T')[0],
        status: record.Attendance === "Checked In" ? "present" : "absent"
      });
    }
  });

  return attendance;
};

/**
 * Fetches all attendance records and maps them to student database IDs.
 * Used for leaderboard and admin views.
 */
export const getAllAttendanceFromSheets = async () => {
  const promises = [];
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    promises.push(
      axios.get(`https://opensheet.elk.sh/${SHEET_ID}/DAY-${i}`)
        .then(res => ({ day: i, data: res.data }))
        .catch(() => ({ day: i, data: [] }))
    );
  }

  const [results, students] = await Promise.all([
    Promise.all(promises),
    User.find({ role: "student" }).select("_id email rollNumber").lean()
  ]);

  // Create mappings for fast lookup
  const emailMap = {};
  const rollMap  = {};
  students.forEach(s => {
    if (s.email) emailMap[s.email.toLowerCase()] = s._id.toString();
    if (s.rollNumber) rollMap[String(s.rollNumber)] = s._id.toString();
  });

  const allRecords = [];

  results.forEach(({ day, data }) => {
    if (!Array.isArray(data)) return;

    const date = new Date(START_DATE);
    date.setUTCDate(START_DATE.getUTCDate() + (day - 1));
    const dateStr = date.toISOString().split('T')[0];

    data.forEach(r => {
      const studentId = emailMap[r.Email?.toLowerCase()] || rollMap[String(r["Roll Number"])];
      if (studentId) {
        allRecords.push({
          student_id: studentId,
          date: dateStr,
          status: r.Attendance === "Checked In" ? "present" : "absent"
        });
      }
    });
  });

  return allRecords;
};
