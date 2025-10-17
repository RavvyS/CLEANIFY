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
      enum: ["Scheduled", "In Progress", "Completed"],
      default: "Scheduled",
    },
  },
  { timestamps: true }
);

const Route = mongoose.model("Route", routeSchema);

export default Route;
