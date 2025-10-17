import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    cityId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    cityName: {
        type: String,
        required: true,
        trim: true
    },
    wasteTypes: [{
        type: String,
        enum: ['general', 'recyclable', 'e-waste', 'organic'],
        required: true
    }],
    pricingModel: {
        type: String,
        enum: ['flat', 'weight-based'],
        required: true
    },
    baseRate: {
        type: Number,
        required: true,
        min: 0
    },
    recyclingCredit: {
        type: Number,
        required: true,
        min: 0
    },
    pickupFrequency: {
        type: Map,
        of: {
            type: String,
            enum: ['daily', 'weekly', 'bi-weekly', 'monthly']
        },
        required: true
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
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Ensure only one active configuration per city
configSchema.index({ cityId: 1, isActive: 1 }, { 
    unique: true, 
    partialFilterExpression: { isActive: true } 
});

const Config = mongoose.model('Config', configSchema);

export default Config;