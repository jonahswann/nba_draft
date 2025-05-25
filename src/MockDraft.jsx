import React, { useState, useEffect } from 'react';
import draftOrder from './data/2025_draft_order_cleaned.json';
import draftData from './data/intern_project_data.json';
import seasonStats from './data/season_stats.json';
import depthStats from './data/depth_stat_data.json';
import PlayerModal from './PlayerModal';
import gameLogs from './data/all_game_logs.json';
import { useNavigate } from 'react-router-dom';


const customHeadshotOverrides = new Set([
  "ACE_BAILEY", "ALEX_KARABAN", "BEN_SARAF", "CARTER_BRYANT", "CHAZZ_LANIER",
  "DINK_PATE", "HUNTER_SALLIS", "ISAIAH_EVANS", "JEREMIAH_FEARS", "JOAN_BERINGER",
  "JOHNI_BROOME", "MALIQUE_LEWIS", "MILES_BYRD", "MOUHAMED_FAYE", "NOAH_PENDA",
  "RYAN_KALKBRENNER", "WILL_RILEY", "YAXEL_LENDEBORG", "ZVONIMIR_IVISIC"
]);

function formatNameFromFullName(fullName) {
  const sanitize = str =>
    str.normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z]/g, '')
      .toUpperCase();

  const parts = fullName.split(' ');
  const first = sanitize(parts[0] || '');
  const last = sanitize(parts.slice(1).join(' ') || '');

  return `${first}_${last}`;
}

function getImageSrc(player, imageErrors) {
  const fileName = formatNameFromFullName(`${player.firstName} ${player.lastName}`);

  if (customHeadshotOverrides.has(fileName)) {
    if (imageErrors[fileName]) {
      return 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
    }
    return `/player_headshots/${fileName}.png`;
  }

  if (player.photoUrl) return player.photoUrl;

  if (imageErrors[fileName]) {
    return 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png';
  }

  return `/player_headshots/${fileName}.png`;
}

const teamNameToLogoFile = {
  "Philadelphia 76ers": "76ers",
  "Portland Trail Blazers": "BLAZERS",
  "Milwaukee Bucks": "BUCKS",
  "Chicago Bulls": "BULLS",
  "Cleveland Cavaliers": "CAVALIERS",
  "LA Clippers": "CLIPPERS",
  "Memphis Grizzlies": "GRIZZLIES",
  "Atlanta Hawks": "HAWKS",
  "Miami Heat": "HEAT",
  "Charlotte Hornets": "HORNETS",
  "Utah Jazz": "JAZZ",
  "Sacramento Kings": "KINGS",
  "New York Knicks": "KNICKS",
  "Los Angeles Lakers": "LAKERS",
  "Orlando Magic": "MAGIC",
  "Dallas Mavericks": "MAVS",
  "Brooklyn Nets": "NETS",
  "Denver Nuggets": "NUGGETS",
  "Indiana Pacers": "PACERS",
  "New Orleans Pelicans": "PELICANS",
  "Detroit Pistons": "PISTONS",
  "Toronto Raptors": "RAPTORS",
  "Houston Rockets": "ROCKETS",
  "San Antonio Spurs": "SPURS",
  "Phoenix Suns": "SUNS",
  "Oklahoma City Thunder": "THUNDER",
  "Minnesota Timberwolves": "TIMBERWOLVES",
  "Golden State Warriors": "WARRIORS",
  "Washington Wizards": "WIZARDS"
};

function getTeamLogoSrc(teamName) {
  const fileBase = teamNameToLogoFile[teamName];
  return fileBase ? `/nba_team_logos/${fileBase}.png` : null;
}

function scoreTeamNeeds(depthChart) {
  const scores = {};
  const positions = ["PG", "SG", "SF", "PF", "C"];

  positions.forEach(pos => {
    const players = depthChart?.[pos] || [];
    const activeCount = players.filter(p => !(p.injuries || []).includes("O")).length;
    const starterInjured = (players.find(p => p.depth === 1)?.injuries || []).includes("O");
    const injuredCount = players.filter(p => (p.injuries || []).includes("O")).length;

    let score = 0;
    if (activeCount === 0) score += 10;
    else if (activeCount === 1) score += 8;
    else if (activeCount === 2) score += 5;

    if (starterInjured) score += 3;
    if (injuredCount >= 2) score += 2;

    scores[pos] = score;
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1]);
}

function findBestFitPlayer(teamName, availablePlayers) {
  const depthChart = depthStats[teamNameToLogoFile[teamName]?.toLowerCase().replace(/[^a-z]/g, '-')];
  if (!depthChart) return availablePlayers[0];

  const needRanking = scoreTeamNeeds(depthChart);

  for (const [position] of needRanking) {
    const match = availablePlayers.find(player => (player.position || '').includes(position));
    if (match) return match;
  }

  return availablePlayers[0];
}

function MockDraft() {
  const [showDraftOrder, setShowDraftOrder] = useState(false);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [takenPlayerIds, setTakenPlayerIds] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [draftLogic, setDraftLogic] = useState(null);
  const [draftedPlayers, setDraftedPlayers] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const navigate = useNavigate();


  const round1 = draftOrder.round_1;
  const round2 = draftOrder.round_2;
  const allPicks = [...round1, ...round2];
  const currentPick = allPicks[currentPickIndex];

  const scoutRanks = draftData.scoutRankings.reduce((acc, curr) => {
    const ranks = Object.entries(curr).filter(([k, v]) => k !== 'playerId' && v !== null).map(([_, v]) => v);
    acc[curr.playerId] = ranks.length ? (ranks.reduce((a, b) => a + b, 0) / ranks.length).toFixed(1) : null;
    return acc;
  }, {});

  const availablePlayers = draftData.bio
    .filter(player => !takenPlayerIds.includes(player.playerId))
    .map(player => ({
      ...player,
      avgRank: scoutRanks[player.playerId] ? parseFloat(scoutRanks[player.playerId]) : Infinity
    }))
    .sort((a, b) => a.avgRank - b.avgRank);

  const mavsDepth = depthStats["Dallas Mavericks"] || {};

  const handleDraft = (playerId) => {
    const draftedPlayer = draftData.bio.find(p => p.playerId === playerId);
    const pickDetails = { ...currentPick, player: draftedPlayer };

    setTakenPlayerIds(prev => [...prev, playerId]);
    setDraftedPlayers(prev => [...prev, pickDetails]);
    setCurrentPickIndex(prev => prev + 1);
  };

  useEffect(() => {
  if (!currentPick || currentPick.team === "Dallas Mavericks" || currentPickIndex >= allPicks.length) return;

  if (draftLogic === 'best-available') {
    const nextBest = availablePlayers[0];
    if (nextBest) {
      const draftedPlayer = draftData.bio.find(p => p.playerId === nextBest.playerId);
      const pickDetails = { ...currentPick, player: draftedPlayer };

      setTakenPlayerIds(prev => [...prev, nextBest.playerId]);
      setDraftedPlayers(prev => [...prev, pickDetails]);
      setTimeout(() => {
        setCurrentPickIndex(prev => prev + 1);
      }, 200);
    }
  }

  if (draftLogic === 'team-need') {
    const bestFit = findBestFitPlayer(currentPick.team, availablePlayers);
    if (bestFit) {
      const draftedPlayer = draftData.bio.find(p => p.playerId === bestFit.playerId);
      const pickDetails = { ...currentPick, player: draftedPlayer };

      setTakenPlayerIds(prev => [...prev, bestFit.playerId]);
      setDraftedPlayers(prev => [...prev, pickDetails]);
      setTimeout(() => {
        setCurrentPickIndex(prev => prev + 1);
      }, 200);
    }
  }
}, [currentPickIndex, currentPick, draftLogic]);

  const handleUndoDraft = () => {
    setTakenPlayerIds(prev => prev.slice(0, -1));
    setDraftedPlayers(prev => prev.slice(0, -1));
    setCurrentPickIndex(prev => Math.max(0, prev - 1));
  };

  const renderPlayerCard = (player) => {
    const stats = seasonStats["2024-25"]?.[`${player.firstName} ${player.lastName}`]?.["Season Averages"]?.stats || {};

    return (
      <div key={player.playerId} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <h4>{player.firstName} {player.lastName} {player.avgRank !== Infinity ? `(Rank: ${player.avgRank})` : ''}</h4>
        <p>Team: {player.currentTeam} | League: {player.league}</p>
        <p>PPG: {stats.PTS || '-'} | REB: {stats.REB || '-'} | AST: {stats.AST || '-'}</p>
        <button onClick={() => handleDraft(player.playerId)}>Draft this player</button>
        <button style={{ marginLeft: '0.5rem' }} onClick={() => setSelectedPlayer(player)}>View Profile</button>
      </div>
    );
  };

  const renderMavsDepth = () => (
    <div>
      <h3>Mavericks Depth Chart</h3>
      {["PG", "SG", "SF", "PF", "C"].map(pos => (
        <div key={pos}>
          <strong>{pos}:</strong> {(mavsDepth[pos] || []).map(p => p.name).join(', ') || '—'}
        </div>
      ))}
    </div>
  );

  const renderDraftResults = () => (
    <div style={{ marginBottom: '2rem' }}>
      <h3>Draft Results</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {draftedPlayers.map((p, idx) => {
          const player = p.player;
          const playerName = `${player.firstName} ${player.lastName}`;
          const fileName = formatNameFromFullName(playerName);
          const teamLogo = getTeamLogoSrc(p.team);
          const photo = getImageSrc(player, imageErrors);

          return (
            <div key={idx} style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '1rem', width: '220px', textAlign: 'center' }}>
              <h4>Pick {p.pick}: {p.team}</h4>
              <img src={photo} alt={playerName} onError={() => setImageErrors(prev => ({ ...prev, [fileName]: true }))} style={{ width: '100px', height: '120px', objectFit: 'cover', borderRadius: '6px' }} /><br />
              <strong>{playerName}</strong><br />
              <img src={teamLogo} alt={`${p.team} Logo`} style={{ width: '50px', height: '50px', marginTop: '0.5rem' }} />
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
      <div style={{padding: '2rem'}}>
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
              position: 'fixed',
              top: '1rem',
              left: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '6px',
              zIndex: 10,
              cursor: 'pointer'
            }}
        >
          ← Back to Home
        </button>
        {(currentPickIndex > 0 || currentPickIndex >= allPicks.length) && (
            <button
                onClick={() => {
                  setCurrentPickIndex(0);
                  setTakenPlayerIds([]);
                  setDraftedPlayers([]);
                  setShowDraftOrder(false);
                  setDraftLogic(null);  // <-- Reset draft logic choice
                }}
                style={{
                  position: 'fixed',
                  top: '1rem',
                  left: '1rem',
                  padding: '0.5rem 1rem',
                  fontSize: '1rem',
                  backgroundColor: '#eee',
                  border: '1px solid #ccc',
                  borderRadius: '6px',
                  zIndex: 10,
                  cursor: 'pointer'
                }}
            >
              ← Back to Draft Builder
            </button>
        )}


        <h1>2025 NBA Mock Draft</h1>

        {draftLogic === null && (
            <div style={{marginBottom: '1rem'}}>
              <label><strong>Select Draft Logic:</strong></label><br/>
              <label>
                <input
                    type="radio"
                    value="best-available"
                    checked={draftLogic === 'best-available'}
                    onChange={(e) => setDraftLogic(e.target.value)}
                /> Best Available
              </label>
              <br/>
              <label>
                <input
                    type="radio"
                    value="team-need"
                    checked={draftLogic === 'team-need'}
                    onChange={(e) => setDraftLogic(e.target.value)}
                /> Based on Team Need
              </label>
            </div>
        )}

        {!showDraftOrder && currentPickIndex < allPicks.length && (
            <>
              <h2>On the Clock: Pick {currentPick.pick} – {currentPick.team}</h2>

              {renderDraftResults()}

              {currentPick.team === "Dallas Mavericks" && (
                  <>
                    {renderMavsDepth()}
                    <h3>All Available Players</h3>
                    {availablePlayers.map(renderPlayerCard)}
                  </>
              )}

              {currentPick.team !== "Dallas Mavericks" && draftLogic === 'team-need' && (
                  <p>Automated pick logic for {currentPick.team} coming soon!</p>
              )}

              <button
                  style={{marginTop: '2rem', marginRight: '1rem'}}
                  onClick={() => setShowDraftOrder(true)}
              >
                View Full Draft Order
              </button>

              {takenPlayerIds.length > 0 && (
                  <button
                      onClick={handleUndoDraft}
                      style={{marginTop: '2rem'}}
                  >
                    Undo Last Pick
                  </button>
              )}
            </>
        )}

        {currentPickIndex >= allPicks.length && renderDraftResults()}

        {showDraftOrder && (
            <>
              <button onClick={() => setShowDraftOrder(false)} style={{marginBottom: '1rem'}}>
                ← Back to Mock Draft Builder
              </button>

              <h2>Round 1</h2>
              <ol>
                {round1.map(p => (
                    <li key={p.pick}><strong>Pick {p.pick}:</strong> {p.team}</li>
                ))}
              </ol>

              <h2>Round 2</h2>
              <ol start={31}>
                {round2.map(p => (
                    <li key={p.pick}><strong>Pick {p.pick}:</strong> {p.team}</li>
                ))}
              </ol>
            </>
        )}

        {selectedPlayer && (
            <PlayerModal
                player={selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
                rankings={draftData.scoutRankings}
                measurements={draftData.measurements}
                gameLogs={gameLogs}
                seasonStats={seasonStats}
                onBack={() => setSelectedPlayer(null)}
            />
        )}
      </div>
  );
}

export default MockDraft;
