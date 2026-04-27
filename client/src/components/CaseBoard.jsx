import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './CaseBoard.css';

const CaseCard = ({ medicalCase }) => {
  return (
    <article className="case-card">
      {/* Cards are H3, because the section they live in is an H2 */}
      <h3>{medicalCase.title}</h3>
      <div className="case-meta">
        <p><strong>System:</strong> {medicalCase.bodySystem}</p>
        <p><strong>Difficulty:</strong> {medicalCase.difficulty}</p>
      </div>
      <Link 
        to={`/case/${medicalCase._id}`} 
        className="btn-primary"
        aria-label={`Open case file for ${medicalCase.title}`}
      >
        Open Case File
      </Link>
    </article>
  );
};

CaseCard.propTypes = {
  medicalCase: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    bodySystem: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CaseBoard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null); 

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/cases`)
      .then((res) => res.json())
      .then((data) => {
        setCases(data);
        setLoading(false);
      });

    fetch(`${import.meta.env.VITE_API_URL}/api/me`, { credentials: 'include' })
      .then((res) => {
        if (res.ok) return res.json();
        return null;
      })
      .then((data) => setUserStats(data))
      .catch((err) => console.error(err));
  }, []);

  if (loading) return <h1 aria-live="polite">Loading the Clinical Archives...</h1>;

  return (
    <main className="board-container">
      {/* 1. H1 MUST BE THE FIRST HEADING ON THE PAGE */}
      <header className="board-header">
        <h1>MedSolve: Clinical Mystery Archive</h1>
      </header>

      {userStats ? (
        <section className="welcome-banner">
          <div className="welcome-text">
            {/* Changed from h2 to p with inline styling to preserve visual hierarchy without breaking screen readers */}
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
              Welcome, Dr. {userStats.username}
            </p>
            <p className="text-muted">Rank: {userStats.role}</p>
          </div>
          <div className="score-display">
            <span style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'var(--color-success)' }}>
              {userStats.casesSolved}
            </span>
            <p className="text-muted">Cases Solved</p>
          </div>
        </section>
      ) : (
        <section className="guest-banner">
          <p>You are viewing the archives as a guest. <Link to="/login" className="text-link">Log in</Link> to save your progress!</p>
        </section>
      )}

      {/* 2. H2 for the main section */}
      <section>
        <h2 style={{ marginBottom: '16px' }}>Active Cold Cases ({cases.length})</h2>
        <div className="case-grid">
          {cases.map((medicalCase) => (
            <CaseCard key={medicalCase._id} medicalCase={medicalCase} />
          ))}
        </div>
      </section>
    </main>
  );
}