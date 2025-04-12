import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: "User registered", user: user });
  } catch (err) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

// update password
router.put("/update-password", auth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Current password is incorrect" });

    // hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // update password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update password" });
  }
});

router.put("/update-email", auth, async (req, res) => {
  const { password, newEmail } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if new email already exists
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already in use by another account",
          user: existingUser
         });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Password is incorrect" });

    // Update email
    user.email = newEmail;
    await user.save();

    res
      .status(200)
      .json({ message: "Email updated successfully", newEmail });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update email" });
  }
});

export default router;
