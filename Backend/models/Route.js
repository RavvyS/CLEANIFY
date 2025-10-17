import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
    routeId: {
        type: String,
        required: true,
        unique: true
    },
    dispatcherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    zones: {
        type: [String],
        required: true,
        validate: {
            validator: function(array) {
                return array && array.length > 0;
            },
            message: "At least one zone is required"
        }
    },
    bins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bin',
        required: true
    }],
    truckId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Truck',
        required: true
    },
    collectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    startTime: Date,
    completedAt: Date,
    status: {
        type: String,
        enum: ["scheduled", "in-progress", "completed", "cancelled"],
        default: "scheduled"
    },
    optimizationMetrics: {
        totalBins: Number,
        estimatedTime: Number,
        zonesCount: Number
    },
    cityId: {
        type: String,
        required: true,
        ref: 'CityConfig'
    }
}, {
    timestamps: true
});

// Add compound index for quick lookups
routeSchema.index({ status: 1, scheduledDate: 1 });
routeSchema.index({ collectorId: 1, status: 1 });
routeSchema.index({ cityId: 1 });

// Auto-generate routeId before saving
routeSchema.pre('save', function(next) {
    if (this.isNew) {
        this.routeId = `RT-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    }
    next();
});

const Route = mongoose.model('Route', routeSchema);
export default Route;