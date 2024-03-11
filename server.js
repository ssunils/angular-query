import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';


// Create server
const app = express();
const PORT = process.env.PORT || 3000;

// Use express json middleware to automatically parse JSON
app.use(express.json(), cors());

// Set up LowDB
const db = await JSONFilePreset('db.json', { todos: [] })

// Initialize the database
const initDB = async () => {
  await db.read();
  db.data ||= { todos: [] }; // If db.json doesn't exist, create todos array
  await db.write();
};

// Routes
// Get all todos
app.get('/todos', async (req, res) => {
  await db.read();
  res.json(db.data.todos);
});

// Create a new todo
app.post('/todos', async (req, res) => {
  const todo = {
    id: Date.now(),
    title: req.body.title,
    completed: false,
  };

  db.data.todos.push(todo);
  await db.write();

  res.status(201).json(todo);
});

// Update a todo
app.patch('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  await db.read();
  const todo = db.data.todos.find(t => t.id == id);

  if (todo) {
    todo.completed = completed;
    await db.write();
    res.json(todo);
  } else {
    res.status(404).json({ message: "Todo not found" });
  }
});

// Delete a todo
app.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  await db.read();
  const todos = db.data.todos.filter(t => t.id != id);
  db.data.todos = todos;

  await db.write();
  res.status(204).send();
});

// Start server
initDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
