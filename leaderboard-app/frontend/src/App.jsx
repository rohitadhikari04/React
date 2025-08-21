import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { API, getUsers, addUser, claimPoints, getLeaderboard, getHistory } from './api'
import UserSelector from './components/UserSelector.jsx'
import AddUserForm from './components/AddUserForm.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import History from './components/History.jsx'
import ClaimPanel from './components/ClaimPanel.jsx'

export default function App(){
  const [socket, setSocket] = useState(null)
  const [users, setUsers] = useState([])
  const [selected, setSelected] = useState('')
  const [leaderboard, setLeaderboard] = useState([])
  const [lastClaim, setLastClaim] = useState(null)

  useEffect(() => {
    const s = io(API, { transports:['websocket'] })
    setSocket(s)
    return () => s.close()
  }, [])

  const refreshAll = async () => {
    const [u, lb] = await Promise.all([getUsers(), getLeaderboard()])
    setUsers(u); setLeaderboard(lb)
  }

  useEffect(() => { refreshAll() }, [])

  useEffect(() => {
    if(!socket) return
    socket.on('leaderboard:update', () => getLeaderboard().then(setLeaderboard))
    socket.on('claim:created', () => getUsers().then(setUsers))
    return () => {
      socket.off('leaderboard:update')
      socket.off('claim:created')
    }
  }, [socket])

  const onAddUser = async (name) => {
    const u = await addUser(name)
    setUsers(prev => [...prev, u])
    setSelected(u._id)
  }

  const onClaim = async () => {
    if(!selected) return alert('Select a user first')
    const res = await claimPoints(selected)
    setLastClaim({ name: users.find(u => u._id === selected)?.name, points: res.points })
  }

  return (
    <div className="container">
      <h1>🏆 Leaderboard</h1>

      <div className="row">
        <div className="col">
          <div className="card">
            <h2>User Actions</h2>
            <UserSelector users={users} selected={selected} onChange={setSelected} />
            <ClaimPanel onClaim={onClaim} lastClaim={lastClaim} />
            <AddUserForm onAdd={onAddUser} />
          </div>
        </div>

        <div className="col">
          <div className="card">
            <h2>Leaderboard</h2>
            <Leaderboard items={leaderboard} />
            <div className="footer">Auto-updates on each claim.</div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Claim History</h2>
        <History />
      </div>
    </div>
  )
}
