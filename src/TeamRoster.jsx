import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import allTeamStats from './data/all_team_stat_data.json';
import depthStats from './data/depth_stat_data.json';
import teamRosters from './data/team_roster_data.json';
import teamTransactions from './data/team_transaction_data.json';
import { fullTeamNames, teamSlugs, depthChartKeys } from './data/teamMaps';

function TeamRoster() {
  const { team } = useParams(); // e.g. "CLIPPERS"
  const navigate = useNavigate();
  const prettyName = fullTeamNames[team.toLowerCase()] || team;

  const statKey = teamSlugs[prettyName]; // like "por"
  const depthKey = depthChartKeys[prettyName]; // like "portland-trail-blazers"
  const rosterKey = prettyName;
  const transactionKey = prettyName;

  const stats = allTeamStats[statKey];
  const depth = depthStats[depthKey];
  const roster = teamRosters[rosterKey];
  const transactions = teamTransactions[transactionKey];

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={() => navigate('/rosters')} style={{ position: 'fixed', top: '1rem', left: '1rem' }}>
        ← Back to Rosters
      </button>

      <img src={`/nba_team_logos/${team}.png`} alt="Team Logo" style={{ position: 'fixed', top: '1rem', right: '1rem', width: 120 }} />
      <h1>{prettyName}</h1>

      {/* Team Stat Leaders */}
      <h2>Team Stat Leaders</h2>
      {stats?.teamLeaders && (
        <ul>
          {stats.teamLeaders.map((s, i) => (
            <li key={i}><strong>{s.stat}</strong>: {s.player} ({s.value})</li>
          ))}
        </ul>
      )}

      {/* Team Totals */}
      <h2>Team Averages</h2>
      {stats?.teamTotals && (
        <table border="1" cellPadding={6}><tbody>
          {Object.entries(stats.teamTotals).map(([k, v]) => (
            <tr key={k}><td>{k}</td><td>{v}</td></tr>
          ))}
        </tbody></table>
      )}

      {/* Player Stats */}
      <h2>Player Stats</h2>
      {stats?.playerStats && (
        <>
          {Object.entries(stats.playerStats).map(([name, stat]) => (
            <div key={name} style={{ marginBottom: '1rem' }}>
              <h3>{name}</h3>
              <table border="1" cellPadding={4}>
                <tbody>
                  {Object.entries(stat).map(([label, val]) => (
                    <tr key={label}><td>{label}</td><td>{val}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </>
      )}

      {/* Depth Chart */}
      <h2>Depth Chart</h2>
      {depth && (
        Object.entries(depth).map(([position, players]) => (
          <div key={position}>
            <h3>{position}</h3>
            <ul>
              {players.map((p, i) => (
                <li key={i}>{p.name} {p.injuries.length > 0 && <span style={{ color: 'red' }}>({p.injuries.join(', ')})</span>}</li>
              ))}
            </ul>
          </div>
        ))
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
