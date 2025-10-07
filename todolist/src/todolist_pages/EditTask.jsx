import React, { useState, useEffect } from 'react';
import { Link,useNavigate,Navigate, useParams } from 'react-router-dom';

const api = import.meta.env.VITE_API_URL;

const EditTask = () => {
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted]=  useState('')
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { id } = useParams(); 
    const stored = JSON.parse(localStorage.getItem('user') || 'null');

    useEffect(() => {
        if (!stored || !stored.id) {
        navigate('/login');
        return;
        }
        async function load(){
            try {
                // const response = await fetch(`http://localhost:8082/todolist/${stored.id}/${id}`, {
                const response = await fetch(`${api}/todolist/${stored.id}/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();

                if (response.ok) {
                    const data=result.data;
                    setTask(data.task);
                    setDescription(data.description)
                    // setCompleted(data.completed)
                } else {
                    setMessage(result.message || 'Failed to get task');
                }
            } catch (error) {
                console.error(error);
                setMessage('Server error while getting task');
            }
        }
        load();
    },[id]);


    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!task.trim()) {
            setMessage('Task name is required');
            return;
        }

        try {
            // const response = await fetch(`http://localhost:8082/todolist/${stored.id}/${id}`, {
            const response = await fetch(`${api}/todolist/${stored.id}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data:{task, description, completed} }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Task updated successfully!');
                setTimeout(() => navigate('/list'), 1500); 
            } else {
                setMessage(result.message || 'Failed to update task');
            }
        } catch (error) {
            console.error(error);
            setMessage('Server error while updating task');
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
        <h3 className="text-center mb-3">Edit Task</h3>
        <form onSubmit={handleUpdate} className="card p-4 shadow-sm border-0">
            <h3>{task} this is here</h3>
            <div className="mb-3">
            <label className="form-label">Task</label>
            <input
                type="text"
                className="form-control"
                name='task'
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter task name"
            />
            </div>
            <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
                className="form-control"
                rows="3"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter updated description"
            ></textarea>
            </div>
            <div className="md-3">
                <label className="form-label">Task Status</label>
                <select className="form-control" name="completed" value={completed} onChange={(e)=>setCompleted(e.target.value)}>
                    <option></option>
                    <option value="Not Completed">Not Completed</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
            <button type="submit" className="btn btn-success w-100">
            Update Task
            </button>
            {message && <p className="mt-3 text-center">{message}</p>}
        </form>
        </div>
        </div>
    );
};

export default EditTask;
