import mongoose from "mongoose";

const tipSchema = new mongoose.Schema(
  {
    text:   { type: String, required: true },
    active: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Tip", tipSchema);
