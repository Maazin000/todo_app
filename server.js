const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/todoApp")
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// Use routes
app.use("/", taskRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));