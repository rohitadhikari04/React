import React, { useEffect, useState } from 'react'
import { getHistory } from '../api.js'

export default function History(){
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit, setLimit] = useState(10)

  const fetchPage = async (p = page) => {
    const data = await getHistory({ page: p, limit })
    setItems(data.items); setTotal(data.total); setPage(data.page); setLimit(data.limit)
  }

  useEffect(() => { fetchPage(1) }, [])

  const pages = Math.max(1, Math.ceil(total / limit))

  return (
    <div>
      <table>
        <thead>
          <tr><th>User</th><th>Points</th><th>When</th></tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id}>
              <td>{i.userName}</td>
              <td>{i.points}</td>
              <td>{new Date(i.createdAt).toLocaleString()}</td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={3}>No claims yet.</td></tr>}
        </tbody>
      </table>
      <div style={{display:'flex', gap:8, marginTop:10}}>
        <button onClick={()=>fetchPage(1)} disabled={page===1}>« First</button>
        <button onClick={()=>fetchPage(page-1)} disabled={page===1}>‹ Prev</button>
        <span className="badge">Page {page} / {pages}</span>
        <button onClick={()=>fetchPage(page+1)} disabled={page===pages}>Next ›</button>
        <button onClick={()=>fetchPage(pages)} disabled={page===pages}>Last »</button>
      </div>
    </div>
  )
}
