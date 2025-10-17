// Backend/routes/inquiryRoutes.js
import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

// Create a new inquiry
router.post("/", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: "Error creating inquiry", error: error.message });
  }
});

// Get all inquiries
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiries", error: error.message });
  }
});

// Get inquiry by ID
router.get("/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
      .populate('userId', 'name email');
    
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    res.status(200).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inquiry", error: error.message });
  }
});

// Update inquiry (respond to inquiry)
router.put("/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        status: 'responded',
        responseDate: new Date()
      },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    res.status(200).json(inquiry);
  } catch (error) {
    res.status(400).json({ message: "Error updating inquiry", error: error.message });
  }
});

// Delete inquiry
router.delete("/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }
    
    res.status(200).json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting inquiry", error: error.message });
  }
});

// Get user's inquiries
router.get("/user/:userId", async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user inquiries", error: error.message });
  }
});

export default router;