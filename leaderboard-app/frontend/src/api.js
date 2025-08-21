const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getUsers(){
  const res = await fetch(`${API}/api/users`);
  return res.json();
}
export async function addUser(name){
  const res = await fetch(`${API}/api/users`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name })
  });
  if(!res.ok) throw new Error('Failed to add user');
  return res.json();
}
export async function claimPoints(userId){
  const res = await fetch(`${API}/api/claim`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ userId })
  });
  if(!res.ok) throw new Error('Claim failed');
  return res.json();
}
export async function getLeaderboard(){
  const res = await fetch(`${API}/api/leaderboard`);
  return res.json();
}
export async function getHistory(params = {}){
  const url = new URL(`${API}/api/history`);
  Object.entries(params).forEach(([k,v]) => v!=null && url.searchParams.set(k, v));
  const res = await fetch(url);
  return res.json();
}
export { API };
