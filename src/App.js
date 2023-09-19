import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/tasks").then((response) => {
      setTasks(response.data);
    });
  }, []);

  const addTask = () => {
    if (!newTask.trim()) {
      return;
    }

    axios
      .post("http://localhost:3000/tasks", { title: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      });
  };

  const deleteTask = (taskId) => {
    axios.delete(`http://localhost:3000/tasks/${taskId}`).then(() => {
      setTasks(tasks.filter((task) => task.id !== taskId));
    });
  };

  const startEditing = (task) => {
    setEditingTask(task);
    setNewTask(task.title);
  };

  const updateTask = () => {
    axios
      .put(`http://localhost:3000/tasks/${editingTask.id}`, {
        title: newTask,
      })
      .then((response) => {
        setTasks(
          tasks.map((task) =>
            task.id === editingTask.id ? response.data : task
          )
        );
        setNewTask("");
        setEditingTask(null);
      });
  };
  return (
    <div className="container">
      <section className="section">
        <h1 className="title is-2">Task Manager</h1>
        <div className="field has-addons">
          <div className="control is-expanded">
            <input
              className="input"
              type="text"
              placeholder="Add a task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </div>
          <div className="control">
            {editingTask ? (
              <button className="button is-warning" onClick={updateTask}>
                Update
              </button>
            ) : (
              <button className="button is-primary" onClick={addTask}>
                Add
              </button>
            )}
          </div>
        </div>
        <ol className="tasks p-4">
          {tasks.map((task) => (
            <li className="task" key={task.id}>
              {task.title}
              <div className="buttons">
                <button
                  className="button is-danger is-small"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
                <button
                  className="button is-warning is-small"
                  onClick={() => startEditing(task)}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
