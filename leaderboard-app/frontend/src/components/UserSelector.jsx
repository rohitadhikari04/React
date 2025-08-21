import React from 'react'

export default function UserSelector({ users, selected, onChange }){
  return (
    <div style={{marginBottom:10}}>
      <label>User</label>
      <select value={selected} onChange={e => onChange(e.target.value)}>
        <option value=''>-- Select a user --</option>
        {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
      </select>
    </div>
  )
}
