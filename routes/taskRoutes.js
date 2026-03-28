const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// GET all tasks (newest first)
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
});

// ADD task
router.post("/add", async (req, res) => {
  const newTask = new Task({ title: req.body.title });
  await newTask.save();
  res.send("Task added");
});

// DELETE task
router.delete("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});

// TOGGLE complete
router.put("/toggle/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.send("Task not found");

    task.completed = !task.completed;
    await task.save();

    res.send("Updated");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

module.exports = router;