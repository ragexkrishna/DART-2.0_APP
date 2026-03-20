import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true },
    description: { type: String, default: "" },
    type:        { type: String, enum: ["important", "reminder", "update", "live", "general"], default: "general" },
    createdBy:   { type: String, default: "" }, // admin name
  },
  { timestamps: true }
);

export default mongoose.model("Announcement", announcementSchema);
