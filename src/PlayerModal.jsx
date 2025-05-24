// PlayerModal.jsx
import React from 'react';
import './styles/PlayerModal.css';
import PlayerProfile from './PlayerProfile';

const PlayerModal = ({ player, onClose, rankings, measurements, gameLogs, seasonStats, onBack }) => {
  if (!player) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="close-btn">✖</button>
        <div style={{ maxHeight: '85vh', overflowY: 'auto' }}>
          {(() => {
            try {
              return (
                <PlayerProfile
                  player={player}
                  rankings={rankings}
                  measurements={measurements}
                  gameLogs={gameLogs}
                  seasonStats={seasonStats}
                  onBack={onBack}
                />
              );
            } catch (err) {
              console.error("Error rendering PlayerProfile:", err);
              return <p style={{ color: 'red' }}>⚠️ Error loading player profile. Check the console for details.</p>;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;
