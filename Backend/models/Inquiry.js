// Backend/models/Inquiry.js
import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'responded'],
    default: 'pending'
  },
  response: {
    type: String,
    default: null
  },
  responseDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;