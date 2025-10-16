import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String },
  message: { type: String, required: true },
  response: { type: String },
  status: { 
    type: String, 
    enum: ["open", "responded"], 
    default: "open" 
  }
}, { timestamps: true });

export default mongoose.model("Inquiry", inquirySchema);