import { useState, useEffect } from "react";
import {
DragDropContext,
Droppable,
Draggable,
} from "@hello-pangea/dnd";
import axios from "axios";
import "./Board.css";

const API = import.meta.env.VITE_API_BASE_URL;
const columns = ['To Do', 'In Progress', 'Done'];

const Board = () => {
const [tasks, setTasks] = useState([]);
const [newTitle, setNewTitle] = useState("");

useEffect(() => {
axios
.get(`${API}/tasks`, {
headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
})
.then((res) => setTasks(res.data))
.catch((err) => console.error("Fetch error:", err));
}, []);

const handleAddTask = async (e) => {
e.preventDefault();
if (!newTitle.trim()) return;

try {
const res = await axios.post(
`${API}/tasks`,
{ title: newTitle },
{ headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
);
setTasks((prev) => [...prev, res.data]);
setNewTitle("");
} catch (err) {
console.error(err);
alert("Failed to create task: " + err.message);
}
};

const onDragEnd = async (result) => {
const { destination, draggableId } = result;
if (!destination) return;

const originalTasks = [...tasks];
const updated = tasks.map((task) =>
task._id === draggableId ? { ...task, status: destination.droppableId } : task
);
setTasks(updated);

try {
await axios.put(
`${API}/tasks/${draggableId}`,
{ status: destination.droppableId },
{
headers: {
Authorization: `Bearer ${localStorage.getItem("token")}`,
},
}
);
} catch (err) {
console.error("Update failed:", err);
setTasks(originalTasks);
}
};
const handleDeleteTask = async (id) => {
  const confirm = window.confirm("Are you sure you want to delete this task?");
  if (!confirm) return;

  const originalTasks = [...tasks];
  setTasks((prev) => prev.filter((t) => t._id !== id));

  try {
    await axios.delete(`${API}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.error("Delete failed:", err);
    alert("Delete failed");
    setTasks(originalTasks); // rollback on error
  }
};


return (
<div>
<form className="task-form" onSubmit={handleAddTask}>
<input
type="text"
placeholder="Enter new task title"
value={newTitle}
onChange={(e) => setNewTitle(e.target.value)}
/>
<button type="submit">Add Task</button>
</form>

<DragDropContext onDragEnd={onDragEnd}>
<div className="board">
{columns.map((col) => (
<Droppable droppableId={col} key={col}>
{(provided) => (
<div className="column">
<h3>{col}</h3>
<div
className="task-list"
ref={provided.innerRef}
{...provided.droppableProps}
>
{tasks
.filter((task) => task.status === col)
.map((task, index) => (
<Draggable
key={task._id}
draggableId={task._id}
index={index}
>
{(provided) => (
<div
className="task"
ref={provided.innerRef}
{...provided.draggableProps}
{...provided.dragHandleProps}
>
{task.title}
<button
    className="delete-btn"
    onClick={() => handleDeleteTask(task._id)}
  >
    ❌
  </button>
</div>
)}
</Draggable>
))}
{provided.placeholder}
</div>
</div>
)}
</Droppable>
))}
</div>
</DragDropContext>
</div>
);
};

export default Board;