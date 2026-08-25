const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/conversations — list, most recently active first
router.get('/', (req, res) => {
  res.json(db.conversations);
});

// GET /api/conversations/:id
router.get('/:id', (req, res) => {
  const conv = db.conversations.find((c) => c.id === Number(req.params.id));
  if (!conv) return res.status(404).json({ error: 'Conversation not found.' });
  res.json(conv);
});

// POST /api/conversations  { withUser: 'name' } — start a private reply thread
router.post('/', (req, res) => {
  const { withUser } = req.body || {};
  if (!withUser) return res.status(400).json({ error: 'withUser is required.' });
  const conv = {
    id: db.nextConvId(),
    name: withUser,
    unread: 0,
    expiry: '7-day',
    typing: false,
    messages: [],
  };
  db.conversations.unshift(conv);
  res.status(201).json(conv);
});

// POST /api/conversations/:id/messages  { text }
router.post('/:id/messages', (req, res) => {
  const conv = db.conversations.find((c) => c.id === Number(req.params.id));
  if (!conv) return res.status(404).json({ error: 'Conversation not found.' });
  const { text } = req.body || {};
  if (!text || !String(text).trim()) return res.status(400).json({ error: 'text is required.' });
  const msg = { id: db.nextMsgId(), from: 'me', text: String(text).trim(), time: 'Now' };
  conv.messages.push(msg);
  conv.typing = false;
  res.status(201).json(msg);
});

// PATCH /api/conversations/:id  { expiry } — change the auto-delete window
router.patch('/:id', (req, res) => {
  const conv = db.conversations.find((c) => c.id === Number(req.params.id));
  if (!conv) return res.status(404).json({ error: 'Conversation not found.' });
  const { expiry } = req.body || {};
  if (expiry) conv.expiry = expiry;
  res.json(conv);
});

// POST /api/conversations/:id/block
router.post('/:id/block', (req, res) => {
  const conv = db.conversations.find((c) => c.id === Number(req.params.id));
  if (!conv) return res.status(404).json({ error: 'Conversation not found.' });
  if (!db.blockedUsers.includes(conv.name)) db.blockedUsers.push(conv.name);
  res.json({ ok: true, blocked: conv.name });
});

// DELETE /api/conversations/:id — leave/delete a conversation
router.delete('/:id', (req, res) => {
  const idx = db.conversations.findIndex((c) => c.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Conversation not found.' });
  db.conversations.splice(idx, 1);
  res.status(204).end();
});

module.exports = router;
