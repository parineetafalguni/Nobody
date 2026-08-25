const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/notifications
router.get('/', (req, res) => {
  res.json(db.notifications);
});

// POST /api/notifications/read-all
router.post('/read-all', (req, res) => {
  db.notifications.forEach((n) => { n.unread = false; });
  res.json({ ok: true });
});

module.exports = router;
