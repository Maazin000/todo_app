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
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// ADD task with ALL fields
router.post("/add", async (req, res) => {
  try {
    const newTask = new Task({ 
      title: req.body.title,
      priority: req.body.priority || 'medium',
      dueDate: req.body.dueDate || null,
      reminderDate: req.body.reminderDate || null,
      category: req.body.category || 'other',
      tags: req.body.tags || []
    });
    await newTask.save();
    res.json({ success: true, task: newTask });
  } catch (err) {
    console.log(err);
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
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        title: req.body.title,
        priority: req.body.priority,
        dueDate: req.body.dueDate,
        reminderDate: req.body.reminderDate,
        category: req.body.category,
        tags: req.body.tags
      },
      { new: true }
    );
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: "Error editing task" });
  }
});

// Contributor 1 routes
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

// Contributor 2 routes
router.get("/tasks/search", async (req, res) => {
  try {
    const { q, status, due } = req.query;
    let query = {};
    if (q && q.trim()) query.title = { $regex: q, $options: 'i' };
    if (status === 'completed') query.completed = true;
    if (status === 'pending') query.completed = false;
    if (due === 'today') {
      const today = new Date(); today.setHours(0,0,0,0);
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
      query.dueDate = { $gte: today, $lt: tomorrow };
    }
    if (due === 'overdue') {
      const today = new Date(); today.setHours(0,0,0,0);
      query.dueDate = { $lt: today, $ne: null };
      query.completed = false;
    }
    const tasks = await Task.find(query).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error searching tasks" });
  }
});

router.get("/tasks/overdue", async (req, res) => {
  try {
    const today = new Date(); today.setHours(0,0,0,0);
    const tasks = await Task.find({ dueDate: { $lt: today, $ne: null }, completed: false });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error fetching overdue tasks" });
  }
});

// Contributor 3 routes
router.get("/categories/stats", async (req, res) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 }, completed: { $sum: { $cond: ["$completed", 1, 0] } } } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

router.get("/export", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Error exporting tasks" });
  }
});

router.post("/import", async (req, res) => {
  try {
    const tasks = req.body;
    await Task.insertMany(tasks);
    res.json({ success: true, count: tasks.length });
  } catch (err) {
    res.status(500).json({ error: "Error importing tasks" });
  }
});

// MongoDB Proof
router.get("/mongodb-proof", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection("tasks");
    const allTasks = await collection.find({}).toArray();
    const count = await collection.countDocuments();
    res.json({
      success: true,
      message: "✅ MongoDB connected to todoApp database",
      database: "todoApp",
      collection: "tasks",
      totalTasks: count,
      tasks: allTasks
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
