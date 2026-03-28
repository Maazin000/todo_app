const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks (newest first)
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

// ADD task
router.post("/add", async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
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
    console.log(err);
    res.status(500).json({ error: "Error deleting task" });
  }
});

// TOGGLE complete
router.put("/toggle/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    task.completed = !task.completed;
    await task.save();
    res.json({ success: true, completed: task.completed });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error toggling task" });
  }
});

// EDIT task (bonus feature)
router.put("/edit/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title },
      { new: true }
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json({ success: true, task });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error editing task" });
  }
});

module.exports = router;