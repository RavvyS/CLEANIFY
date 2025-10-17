// Backend/models/Announcement.js
import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  targetAudience: {
    type: String,
    enum: ['all', 'admin', 'dispatcher', 'collector', 'householder'],
    default: 'all'
  },
  date: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Announcement = mongoose.model('Announcement', announcementSchema);
export default Announcement;