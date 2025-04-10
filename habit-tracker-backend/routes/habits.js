import express from "express";
import Habit from "../models/Habit.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Get all habits for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const habits = await Habit.find({ userId: req.userId });
    res.json(habits);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new habit for the logged-in user
router.post("/", auth, async (req, res) => {
  const habit = new Habit({
    name: req.body.name,
    frequency: req.body.frequency,
    completedDates: [],
    userId: req.userId,
  });

  try {
    const newHabit = await habit.save();
    res.status(201).json(newHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Toggle habit completion for a date (for the logged-in user)
router.patch("/:id/toggle", auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const dateIndex = habit.completedDates.indexOf(req.body.date);

    if (dateIndex > -1) {
      habit.completedDates.splice(dateIndex, 1);
    } else {
      habit.completedDates.push(req.body.date);
    }

    const updatedHabit = await habit.save();
    res.json(updatedHabit);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a habit (only if it belongs to the logged-in user)
router.delete("/:id", auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await habit.deleteOne();
    res.json({ message: "Habit deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
