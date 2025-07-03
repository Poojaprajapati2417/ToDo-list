// src/App.jsx
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';


export default function App() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');
  const [toggledIndex, setToggledIndex] = useState(null);



  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    if (!task.trim()) {
        toast.error('Task cannot be empty!');
      return;
    }
    setError('');
    if (editId !== null) {
      setTasks(tasks.map((t, i) => (i === editId ? { ...t, name: task } : t)));
      setEditId(null);
    } else {
      setTasks([...tasks, { name: task, completed: false }]);
    }
    setTask('');
    toast.success('Task added!');

  };

  const handleDelete = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
    toast.success('Task deleted');

  };

  const handleEdit = (index) => {
    setTask(tasks[index].name);
    setEditId(index);
    setError('');
    toast('Task updated ✏️');


  };

  const handleToggle = (index) => {
     const updatedTasks = tasks.map((t, i) =>
    i === index ? { ...t, completed: !t.completed } : t
  );

  const toggledTask = updatedTasks[index];

  setTasks(updatedTasks);

  if (toggledTask.completed) {
    toast.success('Task completed 🎉');
  } else {
    toast('Task marked as incomplete ❌');
  }

    // Trigger animation temporarily
    setToggledIndex(index);
    setTimeout(() => setToggledIndex(null), 500); // animation lasts 500ms
  };


  const filteredTasks =
    filter === 'active'
      ? tasks.filter((t) => !t.completed)
      : filter === 'completed'
        ? tasks.filter((t) => t.completed)
        : tasks;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-300 to-blue-200 flex flex-col items-center px-4 py-10">
      <h1 className="text-2xl md:text-4xl font-bold text-gray-800 mb-6">📝 My To-Do List</h1>

      <div className="w-full max-w-md flex flex-col mb-6">
        <div className="flex">
          <input
            className="box-border flex-1 p-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            type="text"
            value={task}
            onChange={(e) => {
              setTask(e.target.value);
              if (e.target.value.trim() !== '' && error) setError('');
            }}
            placeholder="Add a new task..."
          />
          <button
            className="transition transform active:scale-95 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-3 rounded-r-lg transition-all duration-150 transform active:scale-95"
            onClick={handleAdd}
          >
            <FaPlus />
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-sm mt-2 transition-opacity duration-300">
            {error}
          </p>
        )}
      </div>



      <div className="mb-4 space-x-2">
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out ${filter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'
            }`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out ${filter === 'active' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'
            }`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ease-in-out ${filter === 'completed' ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'
            }`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </div>

      <ul className="w-full max-w-md space-y-3">
        {filteredTasks.map((t, i) => (
          <li
            key={i}
            className="bg-white opacity-0 animate-fadeInUp shadow-md p-4 rounded-lg flex items-center justify-between"
          >
            <div
              className={`flex items-center gap-2 cursor-pointer ${t.completed ? 'line-through text-gray-400' : ''
                }`}
              onClick={() => handleToggle(i)}
            >
              <FaCheck
                className={`text-sm ${t.completed ? 'text-green-500' : 'text-gray-300'}  ${toggledIndex === i ? 'animate-bounce' : ''}`}
              />
              <span className="text-base">{t.name}</span>
            </div>
            <div className="space-x-2">
              <button
                className="text-yellow-500 hover:text-yellow-600 transition-transform transform active:scale-90"
                onClick={() => handleEdit(i)}
              >
                <FaEdit />
              </button>
              <button
                className="text-red-500 hover:text-red-600 transition-transform transform active:scale-90"
                onClick={() => handleDelete(i)}
              >
                <FaTrash />
              </button>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
