import mongoose from "mongoose";

const collectionRecordSchema = new mongoose.Schema({
    routeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Route',
        required: true
    },
    binId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bin',
        required: true
    },
    collectorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    householderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collectedAt: {
        type: Date,
        default: Date.now
    },
    wasteWeight: {
        type: Number,
        required: [true, "Waste weight is required"],
        min: [0, "Weight cannot be negative"]
    },
    wasteType: {
        type: String,
        required: true,
        enum: ["general", "recyclable", "e-waste", "organic"]
    },
    notes: String,
    collected: {
        type: Boolean,
        default: false
    },
    issue: {
        type: {
            type: String,
            enum: ["damaged", "blocked-access", "overflow", "other"]
        },
        description: String,
        reportedAt: Date,
        resolved: {
            type: Boolean,
            default: false
        }
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
collectionRecordSchema.index({ routeId: 1 });
collectionRecordSchema.index({ binId: 1, collectedAt: 1 });
collectionRecordSchema.index({ householderId: 1, collectedAt: 1 });
collectionRecordSchema.index({ cityId: 1 });

const CollectionRecord = mongoose.model('CollectionRecord', collectionRecordSchema);
export default CollectionRecord;