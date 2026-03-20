import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "reviewed"],
      default: "open",
    },
    important: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
