// Backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },
  address: {
    type: String,
    required: [true, "Address is required"]
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"]
  },
  role: {
    type: String,
    enum: ['admin', 'dispatcher', 'collector', 'householder'],
    required: [true, "Role is required"]
  },
  cityId: {
    type: String,
    required: false,
    ref: 'CityConfig'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;