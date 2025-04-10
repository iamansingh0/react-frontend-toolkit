import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  frequency: { 
    type: String, 
    enum: ["daily", "weekly"], 
    required: true 
  },
  completedDates: [{ 
    type: String 
  }],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Habit = mongoose.model('Habit', habitSchema);
export default Habit;