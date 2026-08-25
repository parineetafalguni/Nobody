const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/communities?q=
router.get('/', (req, res) => {
  const { q } = req.query;
  let results = db.communities;
  if (q) {
    const needle = String(q).toLowerCase();
    results = results.filter(
      (c) => c.name.toLowerCase().includes(needle) || c.desc.toLowerCase().includes(needle)
    );
  }
  res.json(results);
});

// POST /api/communities/:id/join
router.post('/:id/join', (req, res) => {
  const community = db.communities.find((c) => c.id === Number(req.params.id));
  if (!community) return res.status(404).json({ error: 'Community not found.' });
  res.json({ ok: true, joined: community.name });
});

module.exports = router;
