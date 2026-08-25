const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/journal — journal entries are never exposed on any public route
router.get('/', (req, res) => {
  res.json(db.journalEntries);
});

// POST /api/journal  { text, mood }
router.post('/', (req, res) => {
  const { text, mood } = req.body || {};
  if (!text || !String(text).trim()) return res.status(400).json({ error: 'text is required.' });
  const entry = { id: db.nextJournalId(), date: 'Just now', mood: mood || '😐', text: String(text).trim() };
  db.journalEntries.unshift(entry);
  res.status(201).json(entry);
});

// PATCH /api/journal/:id  { text }
router.patch('/:id', (req, res) => {
  const entry = db.journalEntries.find((j) => j.id === Number(req.params.id));
  if (!entry) return res.status(404).json({ error: 'Entry not found.' });
  const { text } = req.body || {};
  if (text) entry.text = String(text).trim();
  res.json(entry);
});

// DELETE /api/journal/:id
router.delete('/:id', (req, res) => {
  const idx = db.journalEntries.findIndex((j) => j.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Entry not found.' });
  db.journalEntries.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
