import React, { useState } from 'react';

function PlayerProfile({ player, rankings, measurements, gameLogs, seasonStats, onBack }) {
  const playerRank = rankings.find(r => r.playerId === player.playerId);
  const playerMeas = measurements.find(m => m.playerId === player.playerId);
  const fullName = `${player.firstName} ${player.lastName}`;

  const playerGamesBySeason = gameLogs[fullName] || {};

  const seasonData = seasonStats["2024-25"]?.[fullName];
  const teamAbbrev = seasonData?.["Season Averages"]?.team || "NA";
  const inchesToFeetAndInches = (inches) => {
    const ft = Math.floor(inches / 12);
    const inch = Math.round(inches % 12);
    return `${ft}'${inch}" (${inches}")`;
  };


  const renderStatsTable = (headers, rowData) => (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', textAlign: 'center' }}>
      <thead>
        <tr>
          {headers.map(header => (
            <th key={header} style={{ borderBottom: '1px solid #ccc', padding: '6px' }}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {rowData.map((val, idx) => (
            <td key={idx} style={{ padding: '6px' }}>{val}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  const [showMeasurements, setShowMeasurements] = useState(false);

const measurementLabels = {
  heightNoShoes: "Height (no shoes)",
  heightShoes: "Height (shoes)",
  wingspan: "Wingspan",
  reach: "Reach",
  maxVertical: "Max Vertical",
  noStepVertical: "No Step Vertical",
  weight: "Weight",
  bodyFat: "Bodyfat",
  handLength: "Hand Length",
  handWidth: "Hand Width",
  agility: "Agility",
  sprint: "Sprint",
  shuttleLeft: "Shuttle Left",
  shuttleRight: "Shuttle Right",
  shuttleBest: "Shuttle Best",
};

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
          <button onClick={onBack} style={{marginBottom: '1rem'}}>← Back to Big Board</button>

          <h2>{player.firstName} {player.lastName}</h2>
          <p><strong>Team:</strong> {player.currentTeam}</p>
          <p><strong>League:</strong> {player.league}</p>
          <p><strong>Height:</strong> {inchesToFeetAndInches(player.height)}</p>
          <p><strong>Weight:</strong> {player.weight} lbs</p>

          {player.photoUrl && (
              <img
                  src={player.photoUrl}
                  alt={player.name}
                  width={150}
                  style={{borderRadius: '8px', margin: '1rem 0'}}
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


          <h3
              style={{cursor: 'pointer', userSelect: 'none', color: '#007bff'}}
              onClick={() => setShowMeasurements(!showMeasurements)}
          >
              Measurements {showMeasurements ? '▲' : '▼'}
          </h3>

          {showMeasurements && playerMeas ? (
              <ul>
                  {Object.entries(playerMeas).map(([key, value]) => {
                      if (key === 'playerId' || value === null) return null;

                      const measurementLabels = {
                          heightNoShoes: "Height (no shoes)",
                          heightShoes: "Height (shoes)",
                          wingspan: "Wingspan",
                          reach: "Reach",
                          maxVertical: "Max Vertical",
                          noStepVertical: "No Step Vertical",
                          weight: "Weight",
                          bodyFat: "Bodyfat",
                          handLength: "Hand Length",
                          handWidth: "Hand Width",
                          agility: "Agility",
                          sprint: "Sprint",
                          shuttleLeft: "Shuttle Left",
                          shuttleRight: "Shuttle Right",
                          shuttleBest: "Shuttle Best",
                      };

                      const inchesToFeetAndInches = (inches) => {
                          const ft = Math.floor(inches / 12);
                          const inch = Math.round(inches % 12);
                          return `${ft}'${inch}" (${inches}")`;
                      };

                      const timeKeys = ["agility", "sprint", "shuttleLeft", "shuttleRight", "shuttleBest"];
                      const inchKeys = ["handLength", "handWidth"];
                      const heightKeys = ["heightNoShoes", "heightShoes", "wingspan", "reach", "maxVertical", "noStepVertical"];

                      let formattedValue = value;

                      if (heightKeys.includes(key)) {
                          formattedValue = inchesToFeetAndInches(value);
                      } else if (inchKeys.includes(key)) {
                          formattedValue = `${value}"`;
                      } else if (key === "weight") {
                          formattedValue = `${value} lbs`;
                      } else if (timeKeys.includes(key)) {
                          formattedValue = `${value} s`;
                      }

                      return (
                          <li key={key}>
                              <strong>{measurementLabels[key] || key}:</strong> {formattedValue}
                          </li>
                      );
                  })}
              </ul>
          ) : !playerMeas && showMeasurements ? (
              <p>No measurements available.</p>
          ) : null}


          <h3>Season Stats</h3>
          {seasonData ? (
              <>
                  {/* Season Averages */}
                  <h4>Season Averages</h4>
                  {renderStatsTable(
                      ['SEASON', 'TEAM', 'GP', 'GS', 'MIN', 'FG', 'FG%', '3PT', '3P%', 'FT', 'FT%', 'REB', 'AST', 'STL', 'BLK', 'PF', 'TO', 'PTS'],
                      [
                          '2024-25',
                          <img
                              src={`/team_logos/${teamAbbrev}.png`}
                              alt={teamAbbrev}
                              width={32}
                              style={{verticalAlign: 'middle', borderRadius: '4px'}}
                          />,
                          seasonData["Season Averages"].stats["GP"],
                          seasonData["Season Averages"].stats["GS"],
                          seasonData["Season Averages"].stats["MIN"],
                          seasonData["Season Averages"].stats["FG"],
                          seasonData["Season Averages"].stats["FG%"],
                          seasonData["Season Averages"].stats["3PT"],
                          seasonData["Season Averages"].stats["3P%"],
                          seasonData["Season Averages"].stats["FT"],
                          seasonData["Season Averages"].stats["FT%"],
                          seasonData["Season Averages"].stats["REB"],
                          seasonData["Season Averages"].stats["AST"],
                          seasonData["Season Averages"].stats["STL"],
                          seasonData["Season Averages"].stats["BLK"],
                          seasonData["Season Averages"].stats["PF"],
                          seasonData["Season Averages"].stats["TO"],
                          seasonData["Season Averages"].stats["PTS"]
                      ]
                  )}

                  {/* Season Totals */}
                  <h4>Season Totals</h4>
                  {renderStatsTable(
                      ['SEASON', 'TEAM', 'FG', 'FG%', '3PT', '3P%', 'FT', 'FT%', 'REB', 'AST', 'STL', 'BLK', 'PF', 'TO', 'PTS'],
                      [
                          '2024-25',
                          <img
                              src={`/team_logos/${teamAbbrev}.png`}
                              alt={teamAbbrev}
                              width={32}
                              style={{verticalAlign: 'middle', borderRadius: '4px'}}
                          />,
                          seasonData["Season Totals"].stats["FG"],
                          seasonData["Season Totals"].stats["FG%"],
                          seasonData["Season Totals"].stats["3PT"],
                          seasonData["Season Totals"].stats["3P%"],
                          seasonData["Season Totals"].stats["FT"],
                          seasonData["Season Totals"].stats["FT%"],
                          seasonData["Season Totals"].stats["REB"],
                          seasonData["Season Totals"].stats["AST"],
                          seasonData["Season Totals"].stats["STL"],
                          seasonData["Season Totals"].stats["BLK"],
                          seasonData["Season Totals"].stats["PF"],
                          seasonData["Season Totals"].stats["TO"],
                          seasonData["Season Totals"].stats["PTS"]
                      ]
                  )}

                  {/* Misc Totals */}
                  <h4>Season Misc Totals</h4>
                  {renderStatsTable(
                      ['SEASON', 'TEAM', 'DD2', 'TD3', 'DQ', 'EJECT', 'TECH', 'FLAG', 'AST/TO', 'STL/TO', 'SC-EFF', 'SH-EFF'],
                      [
                          '2024-25',
                          <img
                              src={`/team_logos/${teamAbbrev}.png`}
                              alt={teamAbbrev}
                              width={32}
                              style={{verticalAlign: 'middle', borderRadius: '4px'}}
                          />,
                          seasonData["Season Misc Totals"].stats["DD2"],
                          seasonData["Season Misc Totals"].stats["TD3"],
                          seasonData["Season Misc Totals"].stats["DQ"],
                          seasonData["Season Misc Totals"].stats["EJECT"],
                          seasonData["Season Misc Totals"].stats["TECH"],
                          seasonData["Season Misc Totals"].stats["FLAG"],
                          seasonData["Season Misc Totals"].stats["AST/TO"],
                          seasonData["Season Misc Totals"].stats["STL/TO"],
                          seasonData["Season Misc Totals"].stats["SC-EFF"],
                          seasonData["Season Misc Totals"].stats["SH-EFF"]
                      ]
                  )}
              </>
          ) : (
              <p>No season stats available.</p>
          )}

          <h3>Game Logs</h3>
          {Object.keys(playerGamesBySeason).length > 0 ? (
              Object.entries(playerGamesBySeason).map(([season, games]) => (
                  <div key={season}>
                      <h4>{season} Season</h4>
                      <table style={{width: '100%', borderCollapse: 'collapse', marginBottom: '2rem'}}>
                          <thead>
                          <tr>
                              <th>Date</th>
                              <th>Opponent</th>
                              <th>Result</th>
                              <th>Score</th>
                              <th>Context</th>
                              <th>PTS</th>
                              <th>REB</th>
                              <th>AST</th>
                              <th>FG%</th>
                              <th>3P%</th>
                              <th>FT%</th>
                          </tr>
                          </thead>
                          <tbody>
                          {games.map((game, index) => (
                              <tr key={`${season}-${index}`}>
                                  <td>{game.date}</td>
                                  <td>{game.opponent}</td>
                                  <td>{game.result}</td>
                                  <td>{game.score}</td>
                                  <td>{game.context || '-'}</td>
                                  <td>{game.stats?.PTS || '0'}</td>
                                  <td>{game.stats?.REB || '0'}</td>
                                  <td>{game.stats?.AST || '0'}</td>
                                  <td>{game.stats?.['FG%'] || '-'}</td>
                                  <td>{game.stats?.['3P%'] || '-'}</td>
                                  <td>{game.stats?.['FT%'] || '-'}</td>
                              </tr>
                          ))}
                          </tbody>
                      </table>
                  </div>
              ))
          ) : (
              <p>No game logs available.</p>
          )}
      </div>
  );
}

export default PlayerProfile;
