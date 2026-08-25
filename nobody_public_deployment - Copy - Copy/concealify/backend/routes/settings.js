const express = require('express');
const db = require('../db');

const router = express.Router();

// ---- Privacy toggles ------------------------------------------------------
router.get('/privacy', (req, res) => {
  res.json({ toggles: db.privacyToggles, blockedUsers: db.blockedUsers });
});

router.patch('/privacy', (req, res) => {
  const updates = req.body || {};
  for (const key of Object.keys(updates)) {
    if (key in db.privacyToggles) db.privacyToggles[key] = Boolean(updates[key]);
  }
  res.json(db.privacyToggles);
});

router.post('/privacy/block', (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: 'username is required.' });
  if (!db.blockedUsers.includes(username)) db.blockedUsers.push(username);
  res.json(db.blockedUsers);
});

router.delete('/privacy/block/:username', (req, res) => {
  const idx = db.blockedUsers.indexOf(req.params.username);
  if (idx !== -1) db.blockedUsers.splice(idx, 1);
  res.json(db.blockedUsers);
});

// ---- Appearance / personalized theme -------------------------------------
// 10 preset theme classes: mood-down, mood-uneasy, mood-neutral, mood-good,
// mood-calm, mood-grief, mood-rose, mood-ocean, mood-amber, mood-slate
router.get('/appearance', (req, res) => {
  res.json(db.appearance);
});

router.patch('/appearance', (req, res) => {
  const { auto, theme, custom } = req.body || {};
  if (typeof auto === 'boolean') db.appearance.auto = auto;
  if (typeof theme === 'string') db.appearance.theme = theme;
  if (custom && typeof custom === 'object') db.appearance.custom = { ...db.appearance.custom, ...custom };
  res.json(db.appearance);
});

router.post('/appearance/reset', (req, res) => {
  db.appearance.custom = {};
  res.json(db.appearance);
});

// ---- Profile ---------------------------------------------------------------
router.get('/profile', (req, res) => {
  res.json(db.profile);
});

module.exports = router;
