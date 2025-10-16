import mongoose from "mongoose";

const wasteRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collectorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  wasteCategory: { 
    type: String, 
    enum: ["organic", "plastic", "glass", "metal", "e-waste", "other"],
    required: true 
  },
  priorityLevel: { 
    type: String, 
    enum: ["low", "medium", "high"], 
    default: "low" 
  },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "completed", "rejected"], 
    default: "pending" 
  },
  remarks: { type: String },
  requestDate: { type: Date, default: Date.now },
  completedDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("WasteRequest", wasteRequestSchema);