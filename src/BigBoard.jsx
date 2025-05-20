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

  const [imageErrors, setImageErrors] = useState({});

  const customHeadshotOverrides = new Set([
    "ACE_BAILEY", "ALEX_KARABAN", "BEN_SARAF", "CARTER_BRYANT", "CHAZZ_LANIER",
    "DINK_PATE", "HUNTER_SALLIS", "ISAIAH_EVANS", "JEREMIAH_FEARS", "JOAN_BERINGER",
    "JOHNI_BROOME", "MALIQUE_LEWIS", "MILES_BYRD", "MOUHAMED_FAYE", "NOAH_PENDA",
    "RYAN_KALKBRENNER", "WILL_RILEY", "YAXEL_LENDEBORG", "ZVONIMIR_IVISIC"
  ]);

  function formatNameFromFullName(fullName) {
    const sanitize = str =>
      str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z]/g, '')
        .toUpperCase();

    const parts = fullName.split(' ');
    const first = sanitize(parts[0] || '');
    const last = sanitize(parts.slice(1).join(' ') || '');

    return `${first}_${last}`;
  }

  const getImageSrc = (player) => {
    const fileName = formatNameFromFullName(player.name);

    // ✅ Override external photoUrl if custom headshot exists
    if (customHeadshotOverrides.has(fileName)) {
      if (imageErrors[fileName]) {
        return 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
      }
      return `/player_headshots/${fileName}.png`;
    }

    // Use external photoUrl if not overridden
    if (player.photoUrl) return player.photoUrl;

    // Fallback to local if photoUrl is null and not in override list
    if (imageErrors[fileName]) {
      return 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
    }
    return `/player_headshots/${fileName}.png`;
  };

  const handleImgError = (fileName) => {
    setImageErrors(prev => ({ ...prev, [fileName]: true }));
  };

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
      <img
        src="/nba_team_logos/MAVS.png"
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
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {players.map((player, index) => {
          const fileName = formatNameFromFullName(player.name);
          const src = getImageSrc(player);

          console.log(`Image source for ${player.name}:`, src);

          return (
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
                  src={src}
                  onError={() => handleImgError(fileName)}
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
          );
        })}
      </ul>
    </div>
  );
}

export default BigBoard;
