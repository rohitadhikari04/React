import React from 'react'

export default function ClaimPanel({ onClaim, lastClaim }){
  return (
    <div style={{marginBottom:10}}>
      <button className="primary" onClick={onClaim}>Claim Random Points</button>
      {lastClaim && (
        <div style={{marginTop:8}}>
          Last claim: <strong>{lastClaim.name}</strong> got <strong>{lastClaim.points}</strong> points 🎉
        </div>
      )}
    </div>
  )
}
