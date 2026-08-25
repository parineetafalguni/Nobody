const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/mood — last 28 days + today's check-in
router.get('/', (req, res) => {
  res.json(db.moodEntries);
});

// POST /api/mood/checkin  { mood: '😐' }
router.post('/checkin', (req, res) => {
  const { mood } = req.body || {};
  if (!mood) return res.status(400).json({ error: 'mood is required.' });
  db.moodEntries.today = mood;
  res.json({ ok: true, mood });
});

// ---- AI pastel color matching -------------------------------------------
// Same keyword fallback the frontend prototype used client-side, kept here
// so the endpoint still works with no ANTHROPIC_API_KEY configured.
function fallbackPastel(text) {
  const t = text.toLowerCase();
  const rules = [
    [/happy|good|great|joy|excit|content/, ['#FFE08A', 'Happy', '🙂', 'soft yellow']],
    [/calm|peace|relax/, ['#D9C8F5', 'Calm', '😌', 'lavender']],
    [/love|grateful|warm|thankful|affection/, ['#FFC9DE', 'Warm', '💗', 'blush pink']],
    [/sad|down|low|lonely|blue|grief|miss/, ['#B8D4F0', 'Low', '😔', 'powder blue']],
    [/anx|stress|nervous|worried|overwhelm/, ['#FFD3B0', 'Anxious', '😟', 'peach']],
    [/angry|frustrat|mad|irritat/, ['#FFB3AB', 'Frustrated', '😤', 'coral']],
  ];
  for (const [re, vals] of rules) {
    if (re.test(t)) return { hex: vals[0], mood: vals[1], emoji: vals[2], name: vals[3] };
  }
  return { hex: '#B8ECD8', mood: 'Neutral', emoji: '😐', name: 'seafoam mint' };
}

// POST /api/mood/ai-color  { text: "how the user describes feeling" }
// Calls the Anthropic API server-side if ANTHROPIC_API_KEY is set; otherwise
// falls back to the local keyword matcher so the endpoint always responds.
router.post('/ai-color', async (req, res) => {
  const { text } = req.body || {};
  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'text is required.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.json({ ...fallbackPastel(text), source: 'fallback' });
  }

  try {
    const prompt = `You are a color-mood assistant for a calm anonymous peer-support app. Reply with ONLY raw JSON, no markdown fences, no extra text, no explanation: {"mood":"<1-2 word mood label>","emoji":"<single emoji>","hex":"<a soft pastel hex color - a shade of yellow, pink, lavender, mint, peach, or sky blue - that fits this mood>","name":"<short pastel color name, e.g. 'soft yellow' or 'blush pink'>"}. The user's feeling: "${String(text).replace(/"/g, "'")}"`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const data = await response.json();
    const raw = (data.content || []).map((b) => b.text || '').join('').trim();
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    res.json({ ...parsed, source: 'ai' });
  } catch (err) {
    console.error('AI color match failed, using fallback:', err.message);
    res.json({ ...fallbackPastel(text), source: 'fallback' });
  }
});

module.exports = router;
