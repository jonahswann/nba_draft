import React, { useState } from 'react';
import draftData from './data/intern_project_data.json';
import gameLogs from './data/all_game_logs.json';
import seasonStats from './data/season_stats.json';
import PlayerProfile from './PlayerProfile';

function BigBoard() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const players = draftData.bio;
  const rankings = draftData.scoutRankings;
  const measurements = draftData.measurements;

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
    <div style={{ padding: '2rem' }}>
      <h1>NBA Draft Hub – Big Board</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={
                  player.photoUrl
                    ? player.photoUrl
                    : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
                }
                alt={`${player.firstName} ${player.lastName}`}
                width={75}
                height={100}
                style={{ borderRadius: '8px', objectFit: 'cover' }}
              />
              <div>
                <h3 style={{ margin: 0 }}>
                  {index + 1}. {player.firstName} {player.lastName}
                </h3>
                <p style={{ margin: 0 }}>{player.currentTeam} – {player.league}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BigBoard;
