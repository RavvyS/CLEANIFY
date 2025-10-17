// Backend/models/WasteRequest.js
import mongoose from "mongoose";

const wasteRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wasteType: {
    type: String,
    required: [true, "Waste type is required"],
    enum: ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'Electronic']
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: 0
  },
  pickupDate: {
    type: Date,
    required: [true, "Pickup date is required"]
  },
  address: {
    type: String,
    required: [true, "Pickup address is required"]
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const WasteRequest = mongoose.model('WasteRequest', wasteRequestSchema);
export default WasteRequest;