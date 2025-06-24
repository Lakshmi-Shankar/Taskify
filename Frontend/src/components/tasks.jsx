import React, { useEffect, useState } from "react";
import "../Tasks.css"; // ← Import the CSS

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTaskName, setEditTaskName] = useState("");
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/all-tasks");
      const data = await res.json();
      if (res.ok) {
        const userTasks = data.tasks.filter((task) => task.user === userId);
        setTasks(userTasks);
      }
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to fetch tasks");
    }
  };

  const handleAddTask = async () => {
    if (!newTask) return;

    try {
      const res = await fetch("http://localhost:5000/api/create-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: newTask, user: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => [...prev, data.task]);
        setNewTask("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Add error:", err.message);
      setError("Could not add task");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/delete-task/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setTasks((prev) => prev.filter((task) => task._id !== id));
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Delete error:", err.message);
      setError("Could not delete task");
    }
  };

  const handleEditInit = (task) => {
    setEditTaskId(task._id);
    setEditTaskName(task.taskName);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/update-task/${editTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskName: editTaskName }),
      });
      const data = await res.json();

      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === editTaskId ? { ...task, taskName: editTaskName } : task
          )
        );
        setEditTaskId(null);
        setEditTaskName("");
      } else {
        setError(data.message);
      }
    } catch (err) {
      console.error("Edit error:", err.message);
      setError("Could not update task");
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Incomplete" : "Completed";
    try {
      const res = await fetch(`http://localhost:5000/api/update-task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (err) {
      console.error("Toggle error:", err.message);
    }
  };

  return (
    <div className="task-container">
      <h2 className="task-title">Your Tasks</h2>

      <div className="input-container">
        <input
          type="text"
          placeholder="New Task"
          className="task-input"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={handleAddTask} className="task-button">
          Add
        </button>
      </div>

      {tasks.length === 0 && !error && (
        <p className="task-empty">No tasks found.</p>
      )}
      {error && <p className="task-error">{error}</p>}

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => toggleStatus(task._id, task.status)}
            className={`task-box ${
              task.status === "Completed" ? "completed" : "incomplete"
            }`}
          >
            {editTaskId === task._id ? (
              <div className="edit-row">
                <input
                  type="text"
                  className="task-input"
                  value={editTaskName}
                  onChange={(e) => setEditTaskName(e.target.value)}
                />
                <button onClick={handleEditSubmit} className="task-button small">
                  Save
                </button>
              </div>
            ) : (
              <div className="task-content">
                <div>
                  <h3 className="task-name">{task.taskName}</h3>
                  <p className="task-status">Status: {task.status}</p>
                  <p className="task-time">
                    Created: {new Date(task.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="task-actions">
                  <button
                    className="edit-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditInit(task);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(task._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
