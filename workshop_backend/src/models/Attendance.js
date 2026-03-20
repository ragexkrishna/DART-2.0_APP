import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date:    String,
  status:  String,
});

export default mongoose.model("Attendance", attendanceSchema);