import mongoose from "mongoose";

const cityConfigSchema = new mongoose.Schema({
    cityId: {
        type: String,
        required: [true, "City ID is required"],
        unique: true
    },
    cityName: {
        type: String,
        required: [true, "City name is required"],
        trim: true
    },
    wasteTypes: {
        type: [String],
        required: true,
        default: ["general", "recyclable", "e-waste", "organic"],
        validate: {
            validator: function(array) {
                return array && array.length > 0;
            },
            message: "At least one waste type is required"
        }
    },
    pricingModel: {
        type: String,
        enum: ["flat", "weight-based"],
        required: true,
        default: "weight-based"
    },
    baseRate: {
        type: Number,
        required: true,
        min: [0, "Base rate cannot be negative"]
    },
    recyclingCredit: {
        type: Number,
        required: true,
        min: [0, "Recycling credit cannot be negative"],
        default: 0
    },
    pickupFrequency: {
        type: Map,
        of: {
            type: String,
            enum: ["daily", "weekly", "bi-weekly", "monthly"]
        },
        required: true,
        validate: {
            validator: function(map) {
                return map.size > 0;
            },
            message: "At least one zone pickup frequency is required"
        }
    },
    version: {
        type: Number,
        default: 1
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Add index for quick lookups
cityConfigSchema.index({ cityId: 1, version: 1 });
cityConfigSchema.index({ isActive: 1 });

const CityConfig = mongoose.model('CityConfig', cityConfigSchema);
export default CityConfig;