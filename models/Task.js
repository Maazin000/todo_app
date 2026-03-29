const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  
  // From Contributor 1
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // From Contributor 2
  dueDate: { type: Date, default: null },
  reminderDate: { type: Date, default: null },
  reminderSent: { type: Boolean, default: false },
  
  // From Contributor 3
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
