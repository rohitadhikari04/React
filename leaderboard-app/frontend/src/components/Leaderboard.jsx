import React from 'react'

export default function Leaderboard({ items }){
  return (
    <table>
      <thead>
        <tr><th>Rank</th><th>Name</th><th>Total Points</th></tr>
      </thead>
      <tbody>
        {items.map(row => (
          <tr key={row._id}>
            <td><span className="badge">#{row.rank}</span></td>
            <td>{row.name}</td>
            <td>{row.totalPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
