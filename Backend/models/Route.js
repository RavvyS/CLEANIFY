import mongoose from "mongoose";

const routeSchema = new mongoose.Schema(
  {
    truck: {
      type: String,
      required: true,
    },
    zones: {
      type: [String],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "in-progress", "completed", "cancelled"],
      default: "scheduled",
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;
