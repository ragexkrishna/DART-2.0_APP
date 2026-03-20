import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    student_id:  { type: String, required: true },
    student_name:{ type: String, required: true },
    title:       String,
    description: String,
    status:      { type: String, default: "open" },
  },
  { timestamps: true }
);

export default mongoose.model("Ticket", ticketSchema);