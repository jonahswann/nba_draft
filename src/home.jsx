import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>NBA Draft Hub</h1>
      <button
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          cursor: 'pointer',
          marginTop: '2rem',
        }}
        onClick={() => navigate('/big-board')}
      >
        View Big Board
      </button>
    </div>
  );
}

export default Home;
