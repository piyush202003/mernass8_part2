import { useState } from 'react'
import { Link,Navigate, useNavigate } from 'react-router-dom';
const api = import.meta.env.VITE_API_URL;

function Signup() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate=useNavigate()
  const handleSignup = (e) => {
    e.preventDefault()
    fetch(`${api}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, password })
    }).then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.data));
          navigate('/login')
        } else {
          alert(data.message || 'SignUp failed');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Network error');
      });
    // console.log('Full Name:', fullName)
    // console.log('Email:', email)
    // console.log('Password:', password)
    // alert('Account created (placeholder)!')
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
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ minWidth: '350px' }}>
        <h3 className="card-title text-center mb-3">Create Account</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-control" 
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Sign Up</button>
        </form>
        <div>
          <p className="text-center mt-3">Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Signup
