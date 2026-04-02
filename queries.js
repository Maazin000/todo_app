// queries.js - Run with: mongosh < queries.js
db = db.getSiblingDB('todoApp');

print("\n========== MONGODB TODO APP DATABASE ==========\n");

print("📋 All tasks (db.tasks.find()):");
db.tasks.find().forEach(printjson);

print("\n📊 Total tasks count: " + db.tasks.count());

print("\n✅ Completed tasks:");
db.tasks.find({ completed: true }).forEach(printjson);

print("\n⏰ Pending tasks:");
db.tasks.find({ completed: false }).forEach(printjson);

print("\n🎯 Tasks by priority:");
db.tasks.aggregate([
  { $group: { _id: "$priority", count: { $sum: 1 } } }
]).forEach(printjson);

print("\n📂 Tasks by category:");
db.tasks.aggregate([
  { $group: { _id: "$category", count: { $sum: 1 } } }
]).forEach(printjson);

print("\n📅 Tasks with due dates:");
db.tasks.find({ dueDate: { $ne: null } }).forEach(printjson);

print("\n========== END ==========\n");