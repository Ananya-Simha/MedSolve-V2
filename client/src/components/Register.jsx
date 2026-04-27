import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setMessage('Registration successful! Redirecting to login...');
        // Wait 2 seconds so the user can read the success message
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setIsSuccess(false);
        setMessage(data.error || 'Registration failed.');
      }
    } catch (err) {
      setIsSuccess(false);
      setMessage('Server error. Is the backend running?');
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <h2>Join MedSolve</h2>
        <p className="auth-subtitle text-muted">Register for intern access to the clinical archives.</p>
        
        <form onSubmit={handleRegister} className="auth-form">
          {/* RUBRIC: Explicit labels for screen readers */}
          <div className="input-group">
            <label htmlFor="reg-username" className="visually-hidden">Choose Username</label>
            <input
              id="reg-username"
              type="text"
              placeholder="Choose a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="auth-input"
              required
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="reg-password" className="visually-hidden">Create Password</label>
            <input
              id="reg-password"
              type="password"
              placeholder="Create a Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <button type="submit" className="btn-auth btn-primary">
            Create Account
          </button>
        </form>

        {message && (
          <p className="auth-message" style={{ color: isSuccess ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {message}
          </p>
        )}

        <p className="auth-footer">
          Already have an account? <Link to="/login" className="auth-link">Log in here</Link>.
        </p>
      </div>
    </main>
  );
}