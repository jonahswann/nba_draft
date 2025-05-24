import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import allTeamStats from './data/all_team_stat_data.json';
import depthStats from './data/depth_stat_data.json';
import teamRosters from './data/team_roster_data.json';
import teamTransactions from './data/team_transaction_data.json';
import { fullTeamNames, teamSlugs, depthChartKeys } from './data/teamMaps';

const statDisplayMap = {
  gamesPlayed: ['GP', 'Games Played'],
  gamesStarted: ['GS', 'Games Started'],
  avgMinutes: ['MIN', 'Minutes Per Game'],
  avgPoints: ['PTS', 'Points Per Game'],
  avgOffensiveRebounds: ['OR', 'Offensive Rebounds Per Game'],
  avgDefensiveRebounds: ['DR', 'Defensive Rebounds Per Game'],
  avgRebounds: ['REB', 'Rebounds Per Game'],
  avgAssists: ['AST', 'Assists Per Game'],
  avgSteals: ['STL', 'Steals Per Game'],
  avgBlocks: ['BLK', 'Blocks Per Game'],
  avgTurnovers: ['TO', 'Turnovers Per Game'],
  avgFouls: ['PF', 'Fouls Per Game'],
  assistTurnoverRatio: ['AST/TO', 'Assist To Turnover Ratio'],
};

const shootingDisplayMap = {
  avgFieldGoalsMade: ['FGM', 'Average Field Goals Made'],
  avgFieldGoalsAttempted: ['FGA', 'Average Field Goals Attempted'],
  fieldGoalPct: ['FG%', 'Field Goal Percentage'],
  avgThreePointFieldGoalsMade: ['3PM', 'Average 3-Point Field Goals Made'],
  avgThreePointFieldGoalsAttempted: ['3PA', 'Average 3-Point Field Goals Attempted'],
  threePointPct: ['3P%', '3-Point Field Goal Percentage'],
  avgFreeThrowsMade: ['FTM', 'Average Free Throws Made'],
  avgFreeThrowsAttempted: ['FTA', 'Average Free Throws Attempted'],
  freeThrowPct: ['FT%', 'Free Throw Percentage'],
  avgTwoPointFieldGoalsMade: ['2PM', '2-Point Field Goals Made Per Game'],
  avgTwoPointFieldGoalsAttempted: ['2PA', '2-Point Field Goals Attempted Per Game'],
  twoPointFieldGoalPct: ['2P%', '2-Point Field Goal Percentage'],
  scoringEfficiency: ['SC-EFF', 'Scoring Efficiency'],
  shootingEfficiency: ['SH-EFF', 'Shooting Efficiency'],
};

function TeamRoster() {
  const { team } = useParams();
  const navigate = useNavigate();
  const prettyName = fullTeamNames[team.toLowerCase()] || team;

  const statKey = teamSlugs[prettyName];
  const depthKey = depthChartKeys[prettyName];
  const rosterKey = prettyName;
  const transactionKey = prettyName;

  const stats = allTeamStats[statKey];
  const depth = depthStats[depthKey];
  const roster = teamRosters[rosterKey];
  const transactions = teamTransactions[transactionKey];

  const statCategories = [
    'gamesPlayed', 'gamesStarted', 'avgMinutes', 'avgPoints', 'avgOffensiveRebounds', 'avgDefensiveRebounds', 'avgRebounds',
    'avgAssists', 'avgSteals', 'avgBlocks', 'avgTurnovers', 'avgFouls', 'assistTurnoverRatio'
  ];

  const shootingCategories = [
    'avgFieldGoalsMade', 'avgFieldGoalsAttempted', 'fieldGoalPct',
    'avgThreePointFieldGoalsMade', 'avgThreePointFieldGoalsAttempted', 'threePointPct',
    'avgFreeThrowsMade', 'avgFreeThrowsAttempted', 'freeThrowPct',
    'avgTwoPointFieldGoalsMade', 'avgTwoPointFieldGoalsAttempted', 'twoPointFieldGoalPct',
    'scoringEfficiency', 'shootingEfficiency'
  ];

  const maxDepth = Math.max(...Object.values(depth || {}).map(arr => arr.length));
  const depthPositions = ['PG', 'SG', 'SF', 'PF', 'C'];

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate('/rosters')} style={{ position: 'fixed', top: '1rem', left: '1rem' }}>
        ← Back to Rosters
      </button>

      <img src={`/nba_team_logos/${team}.png`} alt="Team Logo" style={{ position: 'fixed', top: '1rem', right: '1rem', width: 120 }} />
      <h1>{prettyName}</h1>

      {/* Team Stat Leaders */}
      <h2>Team Stat Leaders</h2>
      {stats?.teamLeaders && roster && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {stats.teamLeaders.map((leader, index) => {
            const player = roster.find(p => p.name.toLowerCase() === leader.player.toLowerCase());
            return (
              <div key={index} style={{
                border: '1px solid #ccc', borderRadius: '12px', padding: '1rem', flex: '1 0 180px', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}>
                <h4>{leader.stat}</h4>
                {player && (
                  <>
                    <img src={player.headshot} alt={player.name} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                    <div><strong>{player.name}</strong></div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{player.position}</div>
                  </>
                )}
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{leader.value}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Team Totals */}
      <h2>Team Averages</h2>
      {stats?.teamTotals && (
        <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
            <tr>
                {Object.keys(stats.teamTotals).map(key => {
                    const [label, title] = statDisplayMap[key] || shootingDisplayMap[key] || [key, ''];
                    return <th key={key} title={title}>{label}</th>;
                })}
            </tr>

            </thead>
            <tbody>
            <tr>{Object.values(stats.teamTotals).map((val, i) => <td key={i}>{val}</td>)}</tr>
            </tbody>
        </table>
      )}

        {/* Player Stats */}
        <h2>Player Stats – All Splits</h2>
      {stats?.playerStats && (
        <>
          <h3>Player Stats</h3>
          <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
              <tr>
                  <th>Name</th>
                  {statCategories.map(cat => {
                      const [label, title] = statDisplayMap[cat] || [cat, ''];
                      return <th key={cat} title={title}>{label}</th>;
                  })}
              </tr>
              </thead>
              <tbody>
              {Object.entries(stats.playerStats).map(([name, stat]) => (
                  <tr key={name}>
                      <td>{name}</td>
                      {statCategories.map(cat => <td key={cat}>{stat[cat]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Shooting Stats</h3>
          <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
              <tr>
                  <th>Name</th>
                  {shootingCategories.map(cat => {
                      const [label, title] = shootingDisplayMap[cat] || [cat, ''];
                      return <th key={cat} title={title}>{label}</th>;
                  })}
              </tr>
              </thead>
              <tbody>
              {Object.entries(stats.playerStats).map(([name, stat]) => (
                  <tr key={name}>
                      <td>{name}</td>
                      {shootingCategories.map(cat => <td key={cat}>{stat[cat]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Depth Chart */}
      <h2>Depth Chart</h2>
      {depth && (
        <>
          <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', width: '100%' }}>
            <thead>
              <tr>
                <th>Position</th>
                {[...Array(maxDepth)].map((_, i) => <th key={i}>{i + 1}TH</th>)}
              </tr>
            </thead>
            <tbody>
              {depthPositions.map(pos => (
                <tr key={pos}>
                  <td><strong>{pos}</strong></td>
                  {[...Array(maxDepth)].map((_, i) => {
                    const player = depth[pos]?.[i];
                    return (
                      <td key={i} style={{ color: player?.injuries?.includes('O') ? 'red' : 'inherit' }}>
                        {player ? `${player.name}${player.injuries.includes('O') ? ' (O)' : ''}` : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem' }}>
            <strong>GLOSSARY</strong><br />
            <strong>PG</strong>: Point Guard &nbsp; <strong>SG</strong>: Shooting Guard &nbsp;
            <strong>SF</strong>: Small Forward &nbsp; <strong>PF</strong>: Power Forward &nbsp; <strong>C</strong>: Center<br />
            <span style={{ color: 'red' }}><strong>O</strong>: Out</span>
          </div>
        </>
      )}

      {/* Roster */}
      <h2>Full Roster</h2>
      {roster && (
        <table border="1" cellPadding={6}>
          <thead>
            <tr>
              <th>Player</th><th>Position</th><th>Age</th><th>Height</th><th>Weight</th><th>Jersey</th><th>Salary</th><th>College</th>
            </tr>
          </thead>
          <tbody>
            {roster.map(player => (
              <tr key={player.name}>
                <td><img src={player.headshot} alt={player.name} width="40" style={{ verticalAlign: 'middle' }} /> {player.name}</td>
                <td>{player.position}</td>
                <td>{player.age}</td>
                <td>{player.height}</td>
                <td>{player.weight}</td>
                <td>{player.jersey}</td>
                <td>{player.salary || '—'}</td>
                <td>{player.college || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Transactions */}
      <h2>Recent Transactions</h2>
      {transactions && (
        <ul>
          {transactions.map((t, i) => (
            <li key={i}><strong>{new Date(t.date).toLocaleDateString()}</strong>: {t.description}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TeamRoster;
