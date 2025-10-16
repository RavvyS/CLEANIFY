import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// ✅ Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find().populate("createdBy", "name role");
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new announcement
router.post("/", async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update announcement
router.put("/:id", async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete announcement
router.delete("/:id", async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;