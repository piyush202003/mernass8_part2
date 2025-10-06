
import React, { useEffect, useState } from "react";
import { Link,Navigate,useNavigate } from "react-router-dom";

const api = import.meta.env.VITE_API_URL;

function Account() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);         
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [saving, setSaving] = useState(false);

  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    if (!storedUser || !storedUser.id) {
      navigate("/login");
      return;
    }

    
    setUser(storedUser);
    setForm({ name: storedUser.name || "", email: storedUser.email || "", password: storedUser.password || "" });

    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // const res = await fetch(`http://localhost:8082/users/${storedUser.id}`, {
        const res = await fetch(`${api}/users/${storedUser.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load todolists');
        setUser(data.data || []);
        setForm({ name: data.data.name || "", email: data.data.email || "", password: data.data.password || "" });
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  
  }, []);
  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-danger">Error: {error}</div>;

  async function handleUpdate(e) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);

    const payload = { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`${api}/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        
        throw new Error(data.message || "Update failed");
      }

      const updatedUser = data.user || data.data || data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setForm(prev => ({ ...prev, password: "" }));
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  async function handleDeleteAccount() {
    if (!user) return;
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${api}/users/${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Delete failed");
      } 
      alert("Account deleted successfully");
      handleLogout();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
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
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h3 className="card-title">Account</h3>

              {loading ? (
                <div className="my-4">Loading profile...</div>
              ) : (
                <>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="mb-3">
                    <strong>Name: </strong> {user?.name || "----"}
                  </div>
                  <div className="mb-3">
                    <strong>Email: </strong> {user?.email || "----"}
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-outline-primary" onClick={() => setEditing(prev => !prev)}>
                      {editing ? "Cancel" : "Update Info"}
                    </button>
                    <button className="btn btn-outline-danger" onClick={handleLogout}>
                      Log out
                    </button>
                    <button className="btn btn-outline-danger" onClick={handleDeleteAccount}>
                      Delete Account
                    </button>
                  </div>

                  {editing && (
                    <form onSubmit={handleUpdate} className="mt-4">
                      <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                          className="form-control"
                          placeholder="Your name"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                          name="email"
                          value={form.email}
                          onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                          type="email"
                          className="form-control"
                          placeholder="Your email"
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">New Password (leave blank to keep)</label>
                        <input
                          name="password"
                          value={form.password}
                          onChange={(e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                          type="password"
                          className="form-control"
                          placeholder="New password"
                        />
                      </div>

                      <div className="d-flex gap-2">
                        <button className="btn btn-success" type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save changes"}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)} disabled={saving}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Account;
