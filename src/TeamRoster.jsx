// TeamRoster.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function TeamRoster() {
  const { team } = useParams();
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem' }}>
      <img
        src={`/nba_team_logos/${team}.png`}
        alt={`${team} Logo`}
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          width: '120px',
          height: '120px',
          objectFit: 'contain',
          zIndex: 10,
        }}
      />
      <button onClick={() => navigate('/rosters')} style={{ marginBottom: '1rem' }}>
        ← Back to Rosters
      </button>
      <h2>{team} Roster</h2>
      <p>This is where you can display the full team roster, stats, salaries, etc.</p>
    </div>
  );
}

export default TeamRoster;
