import express from "express";
import Route from "../models/Route.js";

const router = express.Router();

// @route   POST api/routes
// @desc    Create a new route
// @access  Public
router.post("/", async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
