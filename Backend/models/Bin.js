import mongoose from "mongoose";

const binSchema = new mongoose.Schema({
    binId: {
        type: String,
        required: [true, "Bin ID is required"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    zone: {
        type: String,
        required: [true, "Zone is required"]
    },
    wasteType: {
        type: String,
        enum: ["general", "recyclable", "e-waste", "organic"],
        required: [true, "Waste type is required"]
    },
    status: {
        type: String,
        enum: ["active", "maintenance", "damaged"],
        default: "active"
    },
    householderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
binSchema.index({ zone: 1, status: 1 });
binSchema.index({ householderId: 1 });
binSchema.index({ cityId: 1 });

const Bin = mongoose.model('Bin', binSchema);
export default Bin;