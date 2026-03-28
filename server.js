const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

mongoose.connect("mongodb://127.0.0.1:27017/todoApp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

const Task = mongoose.model("Task", {
  title: String
});

app.post("/add", async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.send("Task added");
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.listen(3000, () => console.log("Server running"));