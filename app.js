const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// In-memory data store
let tasks = [];
let currentId = 1;


// 1. GET /tasks - Retrieve all tasks

app.get("/tasks", (req, res) => {
  res.status(200).json(tasks);
});


// 2. GET /tasks/:id - Retrieve a single task by ID

app.get("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});


// 3. POST /tasks - Create a new task

app.post("/tasks", (req, res) => {
  const { title, description, completed } = req.body;

  // Validation: Title and Description are required
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  // Validation: Completed status must be boolean if provided
  if (completed !== undefined && typeof completed !== "boolean") {
    return res
      .status(400)
      .json({ error: "Completed status must be a boolean" });
  }

  const newTask = {
    id: currentId++,
    title,
    description,
    completed: completed || false, // Default to false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});


// 4. PUT /tasks/:id - Update an existing task

app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find((t) => t.id === id);

  // Error: Task not found
  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const { title, description, completed } = req.body;

  // Validation: valid input check
  if (!title || !description || typeof completed !== "boolean") {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // Update task properties
  task.title = title;
  task.description = description;
  task.completed = completed;

  res.status(200).json(task);
});


// 5. DELETE /tasks/:id - Delete a task

app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

// Export app for testing (important for npm run test)
module.exports = app;

// Start server only if file is run directly
if (require.main === module) {
  app.listen(port, (err) => {
    if (err) {
      return console.log("Something bad happened", err);
    }
    console.log(`Server is listening on ${port}`);
  });
}
