const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AADHAAR_REGEX = /^[0-9]{12}$/;
const PAN_REGEX = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.get('/api/schema', (req, res) => {
  const f = path.join(__dirname, 'schema.json');
  if (!fs.existsSync(f)) return res.status(404).json({ error: 'schema.json not found' });
  res.sendFile(f);
});
const otpStore = new Map();
app.post('/api/send-otp', (req, res) => {
  const { aadhaar } = req.body || {};
  if (!aadhaar || !AADHAAR_REGEX.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar' });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(aadhaar, { otp, createdAt: Date.now() });
  console.log(`SIMULATED OTP for ${aadhaar}: ${otp}`);
  return res.json({ message: 'OTP generated (simulated)' });
});
app.post('/api/validate', (req, res) => {
  const { aadhaar, pan, otp } = req.body || {};
  if (!aadhaar || !AADHAAR_REGEX.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar' });
  if (!pan || !PAN_REGEX.test(pan)) return res.status(400).json({ error: 'Invalid PAN' });
  const rec = otpStore.get(aadhaar);
  if (!rec || rec.otp !== String(otp)) return res.status(400).json({ error: 'Invalid or expired OTP' });
  return res.json({ ok: true });
});
app.post('/api/submit', async (req, res) => {
  const { aadhaar, pan, pincode, city, state } = req.body || {};
  if (!aadhaar || !AADHAAR_REGEX.test(aadhaar)) return res.status(400).json({ error: 'Invalid Aadhaar' });
  if (!pan || !PAN_REGEX.test(pan)) return res.status(400).json({ error: 'Invalid PAN' });
  try {
    const rec = await prisma.submission.create({ data: { aadhaar, pan, pincode, city, state } });
    return res.json(rec);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'DB error' });
  }
});
const port = process.env.PORT || 4000;
app.listen(port, () => { console.log(`Backend listening on ${port}`); });
module.exports = app;