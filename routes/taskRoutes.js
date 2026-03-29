const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// ADD task with priority
router.post("/add", async (req, res) => {
  try {
    const newTask = new Task({ 
      title: req.body.title,
      priority: req.body.priority || 'medium'  
    });
    await newTask.save();
    res.json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ error: "Error adding task" });
  }
});


// DELETE task
router.delete("/delete/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

// TOGGLE complete
router.put("/toggle/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;
    await task.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Error toggling task" });
  }
});

// EDIT task
router.put("/edit/:id", async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { 
      title: req.body.title,
      priority: req.body.priority  
    },
    { new: true }
  );
  res.json({ success: true, task });
});

// DASHBOARD STATISTICS
router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ completed: true });
    
    const priorityStats = await Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);
    
    res.json({
      totalTasks,
      completedTasks,
      pendingTasks: totalTasks - completedTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0,
      priorityStats
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

module.exports = router;
