import React, { useState } from 'react';
import draftOrder from './data/2025_draft_order_cleaned.json';
import draftData from './data/intern_project_data.json';
import seasonStats from './data/season_stats.json';
import depthStats from './data/depth_stat_data.json';
import PlayerModal from './PlayerModal';
import gameLogs from './data/all_game_logs.json';

function MockDraft() {
  const [showDraftOrder, setShowDraftOrder] = useState(false);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [takenPlayerIds, setTakenPlayerIds] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const round1 = draftOrder.round_1;
  const round2 = draftOrder.round_2;
  const currentPick = round1[currentPickIndex];

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
    setTakenPlayerIds(prev => [...prev, playerId]);
    setCurrentPickIndex(prev => prev + 1);
  };

  const handleUndoDraft = () => {
    setTakenPlayerIds(prev => prev.slice(0, -1));
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

  const renderMavsDepth = () => {
    return (
      <div>
        <h3>Mavericks Depth Chart</h3>
        {["PG", "SG", "SF", "PF", "C"].map(pos => (
          <div key={pos}>
            <strong>{pos}:</strong> {(mavsDepth[pos] || []).map(p => p.name).join(', ') || '—'}
          </div>
        ))}
      </div>
    );
  };

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

      <h1>2025 NBA Mock Draft</h1>

      {!showDraftOrder && (
        <>
          <h2>On the Clock: Pick {currentPick.pick} – {currentPick.team}</h2>

          {currentPick.team === "Dallas Mavericks" && (
            <>
              {renderMavsDepth()}
              <h3>All Available Players</h3>
              {availablePlayers.map(renderPlayerCard)}
            </>
          )}

          {currentPick.team !== "Dallas Mavericks" && (
            <p>Automated pick logic for {currentPick.team} coming soon!</p>
          )}

          <button
            style={{ marginTop: '2rem', marginRight: '1rem' }}
            onClick={() => setShowDraftOrder(true)}
          >
            View Full Draft Order
          </button>

          {takenPlayerIds.length > 0 && (
            <button
              onClick={handleUndoDraft}
              style={{ marginTop: '2rem' }}
            >
              Undo Last Pick
            </button>
          )}
        </>
      )}

      {showDraftOrder && (
        <>
          <button onClick={() => setShowDraftOrder(false)} style={{ marginBottom: '1rem' }}>
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
