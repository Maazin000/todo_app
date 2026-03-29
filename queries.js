// queries.js - Updated with Priority
db = db.getSiblingDB('todoApp');

print("\n========== TODO APP - MONGODB DATABASE ==========\n");

print("=== All Tasks (with Priority) ===");
db.tasks.find().forEach(printjson);

print("\n=== Tasks Grouped by Priority ===");
db.tasks.aggregate([
  {
    $group: {
      _id: "$priority",
      count: { $sum: 1 },
      tasks: { $push: "$title" }
    }
  }
]).forEach(printjson);

print("\n=== Pending Tasks ===");
db.tasks.find({ completed: false }).forEach(printjson);

print("\n=== Completed Tasks ===");
db.tasks.find({ completed: true }).forEach(printjson);

print("\n=== Task Count ===");
print("Total tasks: " + db.tasks.count());
print("Completed: " + db.tasks.count({ completed: true }));
print("Pending: " + db.tasks.count({ completed: false }));

print("\n=== Priority Distribution ===");
print("Urgent: " + db.tasks.count({ priority: "urgent" }));
print("High: " + db.tasks.count({ priority: "high" }));
print("Medium: " + db.tasks.count({ priority: "medium" }));
print("Low: " + db.tasks.count({ priority: "low" }));

print("\n=== Latest 5 Tasks ===");
db.tasks.find().sort({ createdAt: -1 }).limit(5).forEach(printjson);

print("\n=== MongoDB Connection Info ===");
print("Database: " + db.getName());
print("Collection: tasks");
print("Total documents: " + db.tasks.count());

print("\n========== END ==========\n");