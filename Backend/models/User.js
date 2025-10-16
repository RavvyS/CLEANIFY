import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  role: { 
    type: String, 
    enum: ["householder", "collector", "council"], 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);