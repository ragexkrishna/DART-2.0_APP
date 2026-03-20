import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: String,
  track:       { type: String, default: "Common" },
  date:        String,
  day:         Number,
  start_time:  String,
  end_time:    String,
  venue:       String,
  instructor:  String,
  type:        { type: String, default: "workshop" },
  status:      { type: String, default: "Upcoming" },
});

export default mongoose.model("Schedule", scheduleSchema);