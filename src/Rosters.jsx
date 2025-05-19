import React from 'react';
import { useNavigate } from 'react-router-dom';

const teams = [
  "76ers", "BLAZERS", "BUCKS", "BULLS", "CAVALIERS", "CLIPPERS", "GRIZZLIES",
  "HAWKS", "HEAT", "HORNETS", "JAZZ", "KINGS", "KNICKS", "LAKERS", "MAGIC",
  "MAVS", "NUGGETS", "PACERS", "PELICANS", "PISTONS", "RAPTORS", "ROCKETS",
  "SPURS", "SUNS", "THUNDER", "TIMBERWOLVES", "WARRIORS", "WIZARDS"
];

function Rosters() {
  const navigate = useNavigate();

  return (
      <div style={{padding: '2rem'}}>
          {/* Back to Home Button */}
          <button
              onClick={() => navigate('/')}
              style={{
                  position: 'fixed',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  zIndex: 10,
              }}
          >
              ← Back to Home
          </button>


          <h1 style={{textAlign: 'center', marginBottom: '2rem'}}>NBA Team Rosters</h1>

          <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1.5rem'}}>
              {teams.map(team => (
                  <button
                      key={team}
                      onClick={() => navigate(`/rosters/${team}`)}
                      style={{
                          background: 'white',
                          border: '1px solid #ccc',
                          padding: '1rem',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          width: '120px',
                          height: '120px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 6px rgba(0,0,0,0.1)'
                      }}
                  >
                      <img
                          src={`/nba_team_logos/${team}.png`}
                          alt={`${team} Logo`}
                          style={{width: '80px', height: '80px', objectFit: 'contain'}}
                      />
                  </button>
              ))}
          </div>
      </div>
  );
}

export default Rosters;
