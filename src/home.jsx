import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
      <div style={{padding: '2rem', position: 'relative'}}>
          <img
              src="/team_logos/MAVS.png"
              alt="Mavs Logo"
              style={{
                  position: 'fixed',
                  top: '1rem',
                  right: '1rem',
                  width: '120px',
                  height: '120px',
                  objectFit: 'contain',
                  zIndex: 10
              }}
          />

          <div style={{textAlign: 'center'}}>
              <h1>NBA Draft Hub</h1>
              <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem'}}>
                  <button
                      style={{
                          padding: '1rem 2rem',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                      }}
                      onClick={() => navigate('/big-board')}
                  >
                      View Big Board
                  </button>
                  <button
                      style={{
                          padding: '1rem 2rem',
                          fontSize: '1.2rem',
                          cursor: 'pointer',
                      }}
                      onClick={() => navigate('/mock-draft')}
                  >
                      Mock Draft
                  </button>
              </div>
          </div>
      </div>
  );
}

export default Home;
