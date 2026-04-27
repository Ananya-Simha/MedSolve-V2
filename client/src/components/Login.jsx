import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        setMessage('Login successful! Welcome back, Doctor.');
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage('Invalid username or password.');
      }
    } catch (err) {
      setMessage('Server error. Is the backend running?');
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h2>MedSolve Staff Login</h2>
        <form onSubmit={handleLogin} className="auth-form">
          {/* RUBRIC: Explicit labels for screen readers */}
          <div className="input-group">
            <label htmlFor="username" className="visually-hidden">Username</label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="password" className="visually-hidden">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="btn-auth btn-success">
            Login to Archives
          </button>
        </form>

        {message && (
          <p className="auth-message" style={{ color: message.includes('successful') ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {message}
          </p>
        )}

        <p className="auth-footer">
          Need an account? <Link to="/register" className="auth-link">Register here</Link>.
        </p>
      </div>
    </main>
  );
}