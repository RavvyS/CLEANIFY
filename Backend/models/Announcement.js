import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  expiryDate: { type: Date },
  visibleTo: { 
    type: [String], 
    enum: ["householder", "collector", "all"], 
    default: ["all"] 
  }
}, { timestamps: true });

export default mongoose.model("Announcement", announcementSchema);