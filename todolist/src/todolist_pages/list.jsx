import React, { useEffect, useState } from 'react';
import { Link,Navigate, useNavigate } from 'react-router-dom';

const api = import.meta.env.VITE_API_URL;

export default function List() {
    const navigate = useNavigate();
    const stored = JSON.parse(localStorage.getItem('user') || 'null');
    const [todos, setTodos] = useState([]);
    const [filteredTodos, setFilteredTodos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    

    useEffect(() => {
        if (!stored || !stored.id) {
            navigate('/login');
            return;
        }

        const controller = new AbortController();
        async function load() {
            try {
                setError(null);
                // const res = await fetch(`http://localhost:8082/todolist/${stored.id}`, {
                const res = await fetch(`${api}/todolist/${stored.id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal: controller.signal
                });

            const data = await res.json();
            // if (!res.ok) throw new Error(data.message || 'Failed to load todolists');

            setTodos(data.data || []);
            setFilteredTodos(data.data || []);
            } catch (err) {
                if (err.name !== 'AbortError') setError(err.message);
            }
        }
        load();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredTodos(
            todos.filter(
                (t) =>
                    t.task?.toLowerCase().includes(term) ||
                    t.description?.toLowerCase().includes(term)
            )
        );
    }, [searchTerm, todos]);

  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  async function createTask() {
    navigate('/create-task');
  }

  async function editTask(task_id) {
    navigate('/edit-task/' + task_id);
  }

  async function deleteTask(task_id) {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
        setError(null);
    //   const res = await fetch(`http://localhost:8082/todolist/${stored.id}/${task_id}`, {
        const res = await fetch(`${api}/todolist/${stored.id}/${task_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Delete failed');

      alert('Task deleted successfully');
      setTodos((prev) => prev.filter((t) => (t._id ?? t.id) !== task_id));
    } catch (err) {
      setError(err.message);
    }
  }

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
    <div className="container py-4">
        
        <h3>My To-Do Lists</h3>

        <div className="d-flex align-items-center mb-3 mt-3">
            <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control w-50"
            />
            <button className="btn btn-primary me-3" onClick={createTask}>
                Create New Task
            </button>
        </div>
        
        {filteredTodos.length === 0 ? (
            <div>No tasks found.</div>
        ) : (
            <div className="list-group mt-3">
            {filteredTodos.map((t) => (
                <div key={t._id ?? t.id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-center">
                    <strong>{t.task || 'Untitled'}</strong>
                    <small className="text-muted">
                    {t.completed}
                    </small>
                </div>
                <div>{t.description || 'No Description'}</div>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                    Created At: {new Date(t.createdAt).toLocaleString() || 'N/A'}
                    </div>
                    <div>
                    Updated At: {new Date(t.updatedAt).toLocaleString() || 'N/A'}
                    </div>
                </div>
                <div>
                    <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => editTask(t._id)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteTask(t._id)}
                    >
                        Delete
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
  );
}
