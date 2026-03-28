const express = require("express");
const mongoose = require("mongoose");

const app = express();

// middleware
app.use(express.json());
app.use(express.static("public"));

// connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todoApp")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// schema + model
const Task = mongoose.model("Task", {
  title: String,
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});


// ✅ ADD TASK
app.post("/add", async (req, res) => {
  const task = new Task({ title: req.body.title });
  await task.save();
  res.send("Task added");
});


// ✅ GET ALL TASKS
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});


// ✅ DELETE TASK
app.delete("/delete/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.send("Deleted");
});


// ✅ TOGGLE COMPLETE
app.put("/toggle/:id", async (req, res) => {
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


// ✅ EDIT TASK (extra feature for marks)
app.put("/edit/:id", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, {
    title: req.body.title
  });
  res.send("Updated");
});


// start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));

const { MongoClient } = require("mongodb");

const client = new MongoClient("mongodb://127.0.0.1:27017");

async function main() {
  await client.connect();
  const db = client.db("todoApp");
  const collection = db.collection("tasks");

  // INSERT
  await collection.insertOne({
    title: "Learn MongoDB",
    completed: false
  });

  // FIND
  const data = await collection.find().toArray();
  console.log(data);

  // UPDATE
  await collection.updateOne(
    { title: "Learn MongoDB" },
    { $set: { completed: true } }
  );

  // DELETE
  await collection.deleteOne({ title: "Learn MongoDB" });
}

main();