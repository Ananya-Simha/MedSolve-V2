import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './CaseDetail.css';

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicalCase, setCase] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cases/${id}`)
      .then((res) => res.json())
      .then((data) => setCase(data));

    fetch(`${import.meta.env.VITE_API_URL}/api/me`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => setUserStats(data));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this case?')) return;
    
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cases/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.ok) {
      navigate('/');
    } else {
      setMessage('Failed to delete. You must be an Attending.');
    }
  };

  const handleDiagnose = async (e) => {
    e.preventDefault();
    if (!userStats) {
      setMessage('You must be logged in to submit a diagnosis.');
      return;
    }
    setMessage(`Diagnosis "${diagnosis}" submitted for review.`);
    setDiagnosis('');
  };

  if (!medicalCase) return <h1 aria-live="polite" className="loading-text">Loading Case File...</h1>;

  return (
    <main className="detail-container">
      <Link to="/" className="back-link">← Back to Archives</Link>
      
      <article className="detail-card">
        <header className="detail-header">
          {/* H1 for the Patient Title */}
          <h1>{medicalCase.title}</h1>
          <div className="badge-group">
            <span className="badge">System: {medicalCase.bodySystem}</span>
            <span className="badge">Difficulty: {medicalCase.difficulty}</span>
          </div>
        </header>

        <section className="detail-body">
          <h2>Chief Complaint & Symptoms</h2>
          <p>{medicalCase.symptoms ? medicalCase.symptoms.join(', ') : 'No symptoms recorded.'}</p>

          <h2 style={{ marginTop: '24px' }}>Patient History</h2>
          <p>{medicalCase.patientHistory || 'No detailed history provided for this case file.'}</p>

          <h2 style={{ marginTop: '24px' }}>Vitals</h2>
          <ul style={{ listStyleType: 'none', padding: 0, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <li style={{ backgroundColor: '#262626', padding: '12px 20px', borderRadius: '6px', border: '1px solid #444' }}>
              <strong>Blood Pressure:</strong> {medicalCase.vitals?.bloodPressure || 'N/A'}
            </li>
            <li style={{ backgroundColor: '#262626', padding: '12px 20px', borderRadius: '6px', border: '1px solid #444' }}>
              <strong>Heart Rate:</strong> {medicalCase.vitals?.heartRate || 'N/A'} bpm
            </li>
            <li style={{ backgroundColor: '#262626', padding: '12px 20px', borderRadius: '6px', border: '1px solid #444' }}>
              <strong>Temperature:</strong> {medicalCase.vitals?.temperature || 'N/A'} °F
            </li>
          </ul>

          <div style={{ marginTop: '32px', padding: '20px', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderLeft: '4px solid var(--color-primary)', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px 0', color: 'var(--color-primary)' }}>Medical Fact</h3>
            <p style={{ margin: 0 }}>{medicalCase.educationalFact || 'No educational fact available for this case.'}</p>
          </div>
        </section>

        <section className="diagnose-section">
          {/* H2 for the next section */}
          <h2>Submit Diagnosis</h2>
          <form onSubmit={handleDiagnose} className="diagnose-form">
            <label htmlFor="diagnosis-input" className="visually-hidden">Submit your diagnosis</label>
            <input
              id="diagnosis-input"
              type="text"
              placeholder="Enter your diagnosis..."
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="detail-input"
              required
            />
            <button type="submit" className="btn-success">Submit</button>
          </form>
          {message && <p className="detail-message">{message}</p>}
        </section>

        {userStats && userStats.role === 'Attending' && (
          <footer className="admin-actions">
            <div className="admin-warning">
              <strong>Attending Privileges:</strong> You have authorization to permanently alter this record.
            </div>
            <button onClick={handleDelete} className="btn-danger">
              Permanently Delete Case
            </button>
          </footer>
        )}
      </article>
    </main>
  );
}