import express from "express";
import Route from "../models/Route.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(adminOnly);

// @route   GET api/routes
// @desc    Get all routes
// @access  Private/Admin
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find().sort({ createdAt: -1 });
    res.json(routes);
  } catch (err) {
    console.error('Get Routes Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   POST api/routes
// @desc    Create a new route
// @access  Private/Admin
router.post("/", async (req, res) => {
  try {
    const newRoute = new Route({
      ...req.body,
      createdBy: req.user._id
    });
    const savedRoute = await newRoute.save();
    res.status(201).json(savedRoute);
  } catch (err) {
    console.error('Create Route Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// @route   GET api/routes/:id
// @desc    Get route by ID
// @access  Private/Admin
router.get("/:id", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error('Get Route Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT api/routes/:id
// @desc    Update route
// @access  Private/Admin
router.put("/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json(route);
  } catch (err) {
    console.error('Update Route Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE api/routes/:id
// @desc    Delete route
// @access  Private/Admin
router.delete("/:id", async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    console.error('Delete Route Error:', err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
