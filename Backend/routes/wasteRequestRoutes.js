// Backend/routes/wasteRequestRoutes.js
import express from "express";
import WasteRequest from "../models/WasteRequest.js";

const router = express.Router();

// Create a new waste request
router.post("/", async (req, res) => {
  try {
    const wasteRequest = new WasteRequest(req.body);
    await wasteRequest.save();
    res.status(201).json(wasteRequest);
  } catch (error) {
    res.status(400).json({ message: "Error creating request", error: error.message });
  }
});

// Get all waste requests
router.get("/", async (req, res) => {
  try {
    const wasteRequests = await WasteRequest.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(wasteRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching requests", error: error.message });
  }
});

// Get waste request by ID
router.get("/:id", async (req, res) => {
  try {
    const wasteRequest = await WasteRequest.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!wasteRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    res.status(200).json(wasteRequest);
  } catch (error) {
    res.status(500).json({ message: "Error fetching request", error: error.message });
  }
});

// Update waste request
router.put("/:id", async (req, res) => {
  try {
    const wasteRequest = await WasteRequest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!wasteRequest) {
      return res.status(404).json({ message: "Request not found" });
    }

    res.status(200).json(wasteRequest);
  } catch (error) {
    res.status(400).json({ message: "Error updating request", error: error.message });
  }
});

// Delete waste request
router.delete("/:id", async (req, res) => {
  try {
    const wasteRequest = await WasteRequest.findByIdAndDelete(req.params.id);
    
    if (!wasteRequest) {
      return res.status(404).json({ message: "Request not found" });
    }
    
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting request", error: error.message });
  }
});

// Get user's waste requests
router.get("/user/:userId", async (req, res) => {
  try {
    const wasteRequests = await WasteRequest.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(wasteRequests);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user requests", error: error.message });
  }
});

export default router;