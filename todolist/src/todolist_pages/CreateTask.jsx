import React, { useState,useEffect } from 'react';
import { Link,Navigate, useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_URL;


const CreateTask = () => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const stored = JSON.parse(localStorage.getItem('user') || 'null');
  const navigate= useNavigate();

  useEffect(()=>{
    if (!stored || !stored.id) {
            navigate('/login');
            return;
        }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.trim()) {
      setMessage('Task name is required');
      return;
    }

    try {
      // const response = await fetch(`http://localhost:8082/todolist/${stored.id}`, {
      const response = await fetch(`${api}/todolist/${stored.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: { task, description },
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Task added successfully!');
        setTask('');
        setDescription('');
        setTimeout(() => navigate('/list'), 1500); 
      } else {
        setMessage(`${result.message || 'Failed to add task'}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Server error while adding task');
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">To-Do List</Link>
                <div >
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link className="nav-link" to="/list">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/account">Account</Link>
                        </li>
                        
                    </ul>
                </div>
            </div>
        </nav>
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-3">Add New Task</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow-sm border-0">
        <div className="mb-3">
          <label className="form-label">Task</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter task title"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            placeholder="Enter task description (optional)"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Add Task
        </button>
        {message && <p className="mt-3 text-center">{message}</p>}
      </form>
    </div>
    </div>
  );
};

export default CreateTask;
