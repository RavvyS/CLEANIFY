import express from "express";
import WasteRequest from "../models/WasteRequest.js";

const router = express.Router();

// ✅ Get all requests
router.get("/", async (req, res) => {
  try {
    const requests = await WasteRequest.find().populate("userId collectorId", "name role");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new waste request (householder)
router.post("/", async (req, res) => {
  try {
    const newRequest = new WasteRequest(req.body);
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update request (collector updates status or remark)
router.put("/:id", async (req, res) => {
  try {
    const updated = await WasteRequest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete request (optional)
router.delete("/:id", async (req, res) => {
  try {
    await WasteRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;