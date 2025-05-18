import React, { useState } from 'react';
import draftData from './data/intern_project_data.json';
import gameLogs from './data/all_game_logs.json';
import seasonStats from './data/season_stats.json';
import PlayerProfile from './PlayerProfile';
import { useNavigate } from 'react-router-dom';


function BigBoard() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const players = draftData.bio;
  const rankings = draftData.scoutRankings;
  const measurements = draftData.measurements;
  const navigate = useNavigate();


  if (selectedPlayer) {
    return (
      <PlayerProfile
        player={selectedPlayer}
        rankings={rankings}
        measurements={measurements}
        gameLogs={gameLogs}
        seasonStats={seasonStats}
        onBack={() => setSelectedPlayer(null)}
      />
    );
  }

  return (
      <div style={{padding: '2rem'}}>
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
          <button
              onClick={() => navigate('/')}
              style={{
                  marginBottom: '1rem',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  background: '#f0f0f0',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  cursor: 'pointer'
              }}
          >
              ← Back to Home
          </button>
          <h1>NBA Draft Hub – Big Board</h1>
          <ul style={{listStyle: 'none', padding: 0}}>
              {players.map((player, index) => (
                  <li
                      key={player.playerId}
                      onClick={() => setSelectedPlayer(player)}
                      style={{
                          marginBottom: '1.5rem',
                          cursor: 'pointer',
                          borderBottom: '1px solid #ccc',
                          paddingBottom: '1rem',
                      }}
                  >
                      <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                          <img
                              src={
                                  player.photoUrl
                                      ? player.photoUrl
                                      : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                              }
                              alt={`${player.firstName} ${player.lastName}`}
                              width={75}
                              height={100}
                              style={{borderRadius: '8px', objectFit: 'cover'}}
                          />
                          <div>
                              <h3 style={{margin: 0}}>
                                  {index + 1}. {player.firstName} {player.lastName}
                              </h3>
                              <p style={{margin: 0}}>{player.currentTeam} – {player.league}</p>
                          </div>
                      </div>
                  </li>
              ))}
          </ul>
      </div>
  );
}

export default BigBoard;
