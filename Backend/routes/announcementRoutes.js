// Backend/routes/announcementRoutes.js
import express from "express";
import Announcement from "../models/Announcement.js";

const router = express.Router();

// Create a new announcement
router.post("/", async (req, res) => {
  try {
    const announcement = new Announcement(req.body);
    await announcement.save();
    res.status(201).json(announcement);
  } catch (error) {
    res.status(400).json({ message: "Error creating announcement", error: error.message });
  }
});

// Get all announcements
router.get("/", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ date: -1 });
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements", error: error.message });
  }
});

// Get announcement by ID
router.get("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.status(200).json(announcement);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcement", error: error.message });
  }
});

// Update announcement
router.put("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json(announcement);
  } catch (error) {
    res.status(400).json({ message: "Error updating announcement", error: error.message });
  }
});

// Delete announcement
router.delete("/:id", async (req, res) => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting announcement", error: error.message });
  }
});

// Get recent announcements (last 5)
router.get("/recent/five", async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ date: -1 })
      .limit(5);
    res.status(200).json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching recent announcements", error: error.message });
  }
});

export default router;