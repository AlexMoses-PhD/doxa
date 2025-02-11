import TextBox from 'components/TextBox';
import { useState } from 'react';
import './UniversityLeaderboard.scss';


const UNIVERSITIES = ['UCL', 'Warwick', 'Glasgow', 'Princeton', 'Imperial', 'Toronto', 'Manchester', 'Oxford', 'Caltech', 'Carnegie Mellon', 'Columbia', 'Georgia Tech', 'Harvard', 'MIT', 'Stanford', 'Bristol', 'UC Berkeley', 'UCLA', 'Cambridge', 'Edinburgh', 'Illinois', 'Michigan', 'St Andrews', 'Waterloo', 'Cornell'];

function ClimateHackUniversityLeaderboardRow({ rank, score, university, participants }) {
  return <div className='ch-uni-leaderboard-entry'>
    <span className="ch-uni-leaderboard-position">{rank}</span>
    <span className="ch-uni-leaderboard-university">{university}</span>
    <span className="ch-uni-leaderboard-participants">{participants}</span>
    <span className="ch-uni-leaderboard-score">{(score / 10000000).toFixed(5)}</span>
  </div>;
}


export default function UniversityLeaderboard({ baseUrl, leaderboard }) {
  const [filter, setFilter] = useState('');
  const lowerFilter = filter.toLowerCase();

  const stats = {};
  for (const university of UNIVERSITIES) {
    stats[university] = {
      university,
      score: 0.0,
      participants: 0,
    };
  }

  for (const row of leaderboard) {
    const university = row.user.university().name;
    stats[university].score = Math.max(stats[university].score, row.score);
    stats[university].participants += 1;
  }

  const rankings = Object.values(stats);
  rankings.sort((a, b) => a.university.localeCompare(b.university));
  rankings.sort((a, b) => b.score - a.score);

  return <div className="ch-uni-leaderboard">
    <TextBox
      type="text"
      placeholder="Filter by university"
      value={filter}
      setValue={setFilter}
    />

    <div className='ch-uni-leaderboard-entry ch-uni-leaderboard-header'>
      <span className="ch-uni-leaderboard-position">#</span>
      <span className="ch-uni-leaderboard-university">University</span>
      <span className="ch-uni-leaderboard-participants">Entrants</span>
      <span className="ch-uni-leaderboard-score">Best score</span>
    </div>

    {rankings.map((entry, i) => (entry.university.toLowerCase().includes(lowerFilter)) && <ClimateHackUniversityLeaderboardRow
      key={i}
      rank={i + 1}
      score={entry.score}
      university={entry.university}
      participants={entry.participants}
      baseUrl={baseUrl}
    />)}
  </div>;
}
