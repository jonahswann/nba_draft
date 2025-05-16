import React from 'react';

function PlayerProfile({ player, rankings, measurements, gameLogs, onBack }) {
  const playerRank = rankings.find(r => r.playerId === player.playerId);
  const playerMeas = measurements.find(m => m.playerId === player.playerId);
  const playerGames = gameLogs.filter(g => g.playerId === player.playerId);

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={onBack} style={{ marginBottom: '1rem' }}>← Back to Big Board</button>

      <h2>{player.firstName} {player.lastName}</h2>
      <p><strong>Team:</strong> {player.currentTeam}</p>
      <p><strong>League:</strong> {player.league}</p>
      <p><strong>Height:</strong> {player.height} in</p>
      <p><strong>Weight:</strong> {player.weight} lbs</p>

      {player.photoUrl && (
        <img
          src={player.photoUrl}
          alt={player.name}
          width={150}
          style={{ borderRadius: '8px', margin: '1rem 0' }}
        />
      )}

      <h3>Scout Rankings</h3>
      {playerRank ? (
        <ul>
          {Object.entries(playerRank).map(([scout, rank]) => {
            if (scout === 'playerId') return null;
            return <li key={scout}>{scout}: {rank ? `#${rank}` : 'Not Ranked'}</li>;
          })}
        </ul>
      ) : (
        <p>No scout rankings available.</p>
      )}

      <h3>Measurements</h3>
      {playerMeas ? (
        <ul>
          {Object.entries(playerMeas).map(([key, value]) => {
            if (key === 'playerId') return null;
            return (
              <li key={key}>
                {key}: {value !== null ? value : 'N/A'}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No measurements available.</p>
      )}

      <h3>Game Logs</h3>
      {playerGames.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Date</th>
              <th>Opponent</th>
              <th>PTS</th>
              <th>REB</th>
              <th>AST</th>
              <th>FGM-FGA</th>
              <th>3PM-3PA</th>
              <th>FTM-FTA</th>
              <th>+/-</th>
            </tr>
          </thead>
          <tbody>
            {playerGames.map(game => (
              <tr key={game.gameId}>
                <td>{game.date.split(' ')[0]}</td>
                <td>{game.opponent}</td>
                <td>{game.pts}</td>
                <td>{game.reb}</td>
                <td>{game.ast}</td>
                <td>{game.fgm}-{game.fga}</td>
                <td>{game.tpm}-{game.tpa}</td>
                <td>{game.ftm}-{game.fta}</td>
                <td>{game.plusMinus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No game logs available.</p>
      )}
    </div>
  );
}

export default PlayerProfile;
