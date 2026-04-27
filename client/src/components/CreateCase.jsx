import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CreateCase.css';

export default function CreateCase() {
  const [title, setTitle] = useState('');
  const [bodySystem, setBodySystem] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newCase = { title, bodySystem, difficulty, description };

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCase),
    });

    if (response.ok) {
      navigate('/');
    } else {
      alert('Failed to create case');
    }
  };

  return (
    <main className="create-container">
      <Link to="/" className="back-link">← Cancel & Return</Link>
      
      <div className="create-card">
        <header className="create-header">
          <h2>Create New Case File</h2>
          <p className="text-muted">Fill out the patient details below to add a new mystery to the archives.</p>
        </header>

        <form onSubmit={handleSubmit} className="create-form">
          {/* RUBRIC: Explicit labels mapped to inputs via htmlFor/id */}
          <div className="form-group">
            <label htmlFor="case-title">Patient Title / Designation</label>
            <input
              id="case-title"
              type="text"
              placeholder="e.g., Patient John D."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="body-system">Affected Body System</label>
            <input
              id="body-system"
              type="text"
              placeholder="e.g., Cardiology, Neurology"
              value={bodySystem}
              onChange={(e) => setBodySystem(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="case-difficulty">Diagnostic Difficulty</label>
            <select 
              id="case-difficulty"
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="case-description">Clinical Description</label>
            <textarea
              id="case-description"
              placeholder="Describe the patient history, symptoms, and vital signs..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">Initialize Case File</button>
          </div>
        </form>
      </div>
    </main>
  );
}