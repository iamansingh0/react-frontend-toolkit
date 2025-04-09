import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  frequency: { type: String, enum: ["daily", "weekly"], required: true },
  completedDates: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export const Habit = mongoose.model('Habit', habitSchema);