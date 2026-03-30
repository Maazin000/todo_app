const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // Contributor 1: Priority
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Contributor 2: Due Dates
  dueDate: { type: Date, default: null },
  reminderDate: { type: Date, default: null },
  reminderSent: { type: Boolean, default: false },
  
  // Contributor 3: Categories & Tags
  category: {
    type: String,
    enum: ['work', 'personal', 'shopping', 'study', 'health', 'other'],
    default: 'other'
  },
  tags: [{ type: String }],
  
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
