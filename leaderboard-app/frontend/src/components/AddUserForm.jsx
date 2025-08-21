import React, { useState } from 'react'

export default function AddUserForm({ onAdd }){
  const [name, setName] = useState('')
  const submit = async (e) => {
    e.preventDefault()
    if(!name.trim()) return
    await onAdd(name.trim())
    setName('')
  }
  return (
    <form onSubmit={submit} style={{marginTop:10}}>
      <label>Add User</label>
      <div style={{display:'flex', gap:8}}>
        <input placeholder="Enter name" value={name} onChange={e=>setName(e.target.value)} />
        <button className="success" type="submit">Add</button>
      </div>
    </form>
  )
}
