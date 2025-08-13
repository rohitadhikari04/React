import React, { useState } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const AADHAAR_REGEX = /^[0-9]{12}$/;
const PAN_REGEX = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;

export default function DynamicForm() {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [pan, setPan] = useState('');
  const [msg, setMsg] = useState('');

  async function sendOtp() {
    setMsg('');
    if (!AADHAAR_REGEX.test(aadhaar)) return setMsg('Invalid Aadhaar');
    const r = await fetch(`${API}/api/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar })
    });
    const j = await r.json();
    if (!r.ok) return setMsg(j.error || 'Error sending OTP');
    setMsg('OTP sent! Check backend console.');
    setStep(1.5);
  }

  async function verifyOtp() {
    setMsg('');
    if (!otp || otp.length !== 6) return setMsg('Enter 6-digit OTP');
    const r = await fetch(`${API}/api/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar, pan, otp })
    });
    const j = await r.json();
    if (!r.ok) return setMsg(j.error || 'Validation failed');
    setStep(2);
  }

  async function submitAll() {
    setMsg('');
    if (!PAN_REGEX.test(pan)) return setMsg('Invalid PAN');
    const r = await fetch(`${API}/api/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aadhaar, pan })
    });
    const j = await r.json();
    if (!r.ok) return setMsg(j.error || 'Submit failed');
    setMsg('Form submitted successfully!');
    setStep(3);
  }

  const inputClass = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonClass = "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 w-full";

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-lg font-semibold mb-4">Step {step}</h2>

      {step === 1 && (
        <>
          <input className={inputClass} placeholder="Enter Aadhaar" value={aadhaar} onChange={e => setAadhaar(e.target.value)} />
          <button className={`${buttonClass} mt-4`} onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 1.5 && (
        <>
          <input className={inputClass} placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <input className={`${inputClass} mt-3`} placeholder="Enter PAN" value={pan} onChange={e => setPan(e.target.value)} />
          <button className={`${buttonClass} mt-4`} onClick={verifyOtp}>Verify & Continue</button>
        </>
      )}

      {step === 2 && (
        <>
          <input className={inputClass} placeholder="Enter PAN" value={pan} onChange={e => setPan(e.target.value)} />
          <button className={`${buttonClass} mt-4`} onClick={submitAll}>Submit</button>
        </>
      )}

      {msg && <div className="mt-4 p-2 text-sm rounded bg-gray-100 text-gray-800">{msg}</div>}
    </div>
  );
}