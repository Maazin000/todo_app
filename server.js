const express = require("express");
const mongoose = require("mongoose");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(express.json());
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todoApp")
  .then(() => console.log("✅ MongoDB Connected to todoApp database"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

app.use("/", taskRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
