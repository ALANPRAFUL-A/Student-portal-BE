import express from "express";
import Club from "../models/Club.js";

const router = express.Router();

// Create a club
router.post("/", async (req, res) => {
  try {
    const newClub = new Club(req.body);
    const saved = await newClub.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Error creating club", err });
  }
});

// Get all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    res.status(200).json(clubs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching clubs", err });
  }
});

// Delete a club
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Club.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Club not found" });
    res.status(200).json({ message: "Club deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting club", err });
  }
});

export default router;
