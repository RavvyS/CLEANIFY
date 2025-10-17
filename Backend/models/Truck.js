import mongoose from "mongoose";

const truckSchema = new mongoose.Schema({
    truckId: {
        type: String,
        required: [true, "Truck ID is required"],
        unique: true
    },
    plateNumber: {
        type: String,
        required: [true, "Plate number is required"],
        unique: true
    },
    capacity: {
        type: Number,
        required: [true, "Capacity is required"],
        min: [0, "Capacity cannot be negative"]
    },
    status: {
        type: String,
        enum: ["available", "assigned", "maintenance"],
        default: "available"
    },
    currentLocation: {
        type: String
    },
    cityId: {
        type: String,
        required: true,
        ref: 'CityConfig'
    }
}, {
    timestamps: true
});

// Add indexes for quick lookups
truckSchema.index({ status: 1 });
truckSchema.index({ cityId: 1 });

const Truck = mongoose.model('Truck', truckSchema);
export default Truck;