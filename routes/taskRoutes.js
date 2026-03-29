const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const mongoose = require("mongoose");

// GET all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// ADD task with priority
router.post("/add", async (req, res) => {
  try {
    console.log("Received data:", req.body);
    
    const newTask = new Task({ 
      title: req.body.title,
      priority: req.body.priority || 'medium'
    });
    
    const savedTask = await newTask.save();
    console.log("Saved task:", savedTask);
    
    res.json({ success: true, task: savedTask });
  } catch (err) {
    console.log("Error details:", err);
    res.status(500).json({ error: err.message });
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
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        title: req.body.title,
        priority: req.body.priority
      },
      { new: true }
    );
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: "Error editing task" });
  }
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
    console.log(err);
    res.status(500).json({ error: "Error fetching stats" });
  }
});

// PROVE MongoDB is being used - Direct database query
router.get("/mongodb-proof", async (req, res) => {
  try {
    // Direct MongoDB query (not using Mongoose)
    const db = mongoose.connection.db;
    const collection = db.collection("tasks");
    
    const allTasks = await collection.find({}).toArray();
    const count = await collection.countDocuments();
    const priorityCount = await collection.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]).toArray();
    const completedCount = await collection.countDocuments({ completed: true });
    const pendingCount = await collection.countDocuments({ completed: false });
    
    res.json({
      success: true,
      message: "✅ MongoDB is connected and working!",
      databaseInfo: {
        databaseName: "todoApp",
        collectionName: "tasks",
        connectionStatus: "Connected",
        mongodbHost: "mongodb://127.0.0.1:27017"
      },
      statistics: {
        totalTasks: count,
        completedTasks: completedCount,
        pendingTasks: pendingCount,
        priorityDistribution: priorityCount
      },
      sampleTasks: allTasks.slice(0, 5),
      mongodbQueriesUsed: [
        "db.tasks.find()",
        "db.tasks.countDocuments()", 
        "db.tasks.aggregate()"
      ]
    });
  } catch (err) {
    console.log("MongoDB proof error:", err);
    res.json({ 
      success: false, 
      error: err.message,
      message: "Make sure MongoDB is running with: mongod"
    });
  }
});

module.exports = router;