const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // Priority System
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  priorityLevel: {
    type: Number,
    default: 2,
    min: 1,
    max: 4
  },
  
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to set priority level
TaskSchema.pre('save', function(next) {
  const priorityMap = { 'low': 1, 'medium': 2, 'high': 3, 'urgent': 4 };
  this.priorityLevel = priorityMap[this.priority];
  next();
});

module.exports = mongoose.model("Task", TaskSchema);
