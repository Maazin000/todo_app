// queries.js - MongoDB Shell Script
// This is NOT Node.js code - it's MongoDB Shell JavaScript

// Connect to your database
// This tells the shell which database to use
db = db.getSiblingDB('todoApp');

// print() - Output text to the console
print("\n=== All Tasks ===");

// forEach() - Loop through each document
// printjson() - Pretty print JSON objects
db.tasks.find().forEach(printjson);

print("\n=== Pending Tasks ===");
db.tasks.find({ completed: false }).forEach(printjson);

print("\n=== Completed Tasks ===");
db.tasks.find({ completed: true }).forEach(printjson);

print("\n=== Task Count ===");
print("Total tasks: " + db.tasks.count());
print("Completed: " + db.tasks.count({ completed: true }));
print("Pending: " + db.tasks.count({ completed: false }));

print("\n=== Latest 5 Tasks ===");
db.tasks.find().sort({ createdAt: -1 }).limit(5).forEach(printjson);

print("\n=== Statistics by Status ===");
// Using aggregation pipeline
db.tasks.aggregate([
  {
    $group: {
      _id: "$completed",
      count: { $sum: 1 }
    }
  }
]).forEach(printjson);

print("\n=== Tasks with 'mongodb' in title ===");
db.tasks.find({
  title: { $regex: "mongodb", $options: "i" }
}).forEach(printjson);