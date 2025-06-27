import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Student from "../models/Student.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { name, email, password, department } = req.body;
  try {
    const existing = await Student.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const hashed = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, password: hashed, department });
    await student.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const users = await Student.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ error: "User not found" });

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET);
    res.json({ token, student });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
