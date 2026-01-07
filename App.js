import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("tasks"));
    if (saved) setTasks(saved);
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;

    if (editingId) {
      setTasks(tasks.map(t =>
        t.id === editingId ? { ...t, text } : t
      ));
      setEditingId(null);
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        text,
        completed: false
      }]);
    }
    setText("");
  };

  const toggleTask = id => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = id => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const editTask = task => {
    setText(task.text);
    setEditingId(task.id);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <div className="app">
      <h1>To-Do List</h1>

      <div className="input-row">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Add a task..."
        />
        <button onClick={addTask}>
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      <div className="filters">
        {["all", "active", "completed"].map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <p className="empty">No Tasks</p>
      ) : (
        <ul>
          {filteredTasks.map(task => (
            <li key={task.id} className={task.completed ? "done" : ""}>
              <span onClick={() => toggleTask(task.id)}>
                {task.text}
              </span>
              <div className="actions">
                <button onClick={() => editTask(task)}>✏️</button>
                <button onClick={() => deleteTask(task.id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
