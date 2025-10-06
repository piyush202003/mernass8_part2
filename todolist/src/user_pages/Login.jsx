import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
const api = import.meta.env.VITE_API_URL;

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate=useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    
    fetch(`${api}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.data));
          navigate('/list')
        } else {
          alert(data.message || 'Login failed');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Network error');
      });
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
        <h3 className="card-title text-center mb-3">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            {/* <label htmlFor="email" className="form-label">Email</label> */}
            <input 
              type="email" 
              className="form-control" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your email'
              required
            />
          </div>
          <div className="mb-3">
            {/* <label htmlFor="password" className="form-label">Password</label> */}
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div>
          <p className="text-center mt-3">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div>
    </div>
  )
}

export default Login
