import express from "express";
import Inquiry from "../models/Inquiry.js";

const router = express.Router();

// ✅ Get all inquiries
router.get("/", async (req, res) => {
  try {
    const inquiries = await Inquiry.find().populate("userId", "name role");
    res.json(inquiries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create inquiry (householder or collector)
router.post("/", async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Respond to inquiry (council)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;