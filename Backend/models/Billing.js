import mongoose from "mongoose";

const billingSchema = new mongoose.Schema({
    billingId: {
        type: String,
        required: true,
        unique: true
    },
    householderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{4}-\d{2}$/.test(v);
            },
            message: props => `${props.value} is not a valid month format (YYYY-MM)!`
        }
    },
    wasteWeight: {
        type: Number,
        required: true,
        min: [0, "Total waste weight cannot be negative"]
    },
    wasteBreakdown: {
        general: { type: Number, default: 0 },
        recyclable: { type: Number, default: 0 },
        organic: { type: Number, default: 0 },
        eWaste: { type: Number, default: 0 }
    },
    baseCharge: {
        type: Number,
        required: true,
        min: [0, "Base charge cannot be negative"]
    },
    recyclingCredits: {
        type: Number,
        required: true,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "overdue"],
        default: "pending"
    },
    paymentDate: Date,
    dueDate: {
        type: Date,
        required: true
    },
    stripePaymentId: String,
    paymentMethod: String,
    cityId: {
        type: String,
        required: true,
        ref: 'CityConfig'
    }
}, {
    timestamps: true
});

// Add indexes for quick lookups
billingSchema.index({ householderId: 1, month: 1 });
billingSchema.index({ paymentStatus: 1 });
billingSchema.index({ cityId: 1 });

// Auto-generate billingId before saving
billingSchema.pre('save', function(next) {
    if (this.isNew) {
        this.billingId = `BILL-${this.month}-${this.householderId.toString().slice(-6)}`;
    }
    next();
});

// Calculate totalAmount before saving
billingSchema.pre('save', function(next) {
    this.totalAmount = this.baseCharge - this.recyclingCredits;
    next();
});

const Billing = mongoose.model('Billing', billingSchema);
export default Billing;