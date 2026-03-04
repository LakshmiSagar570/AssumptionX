// api/analyze.js — Vercel Serverless Function (CommonJS)

const SYSTEM_PROMPT = `You are a Blind Spot Detector — a ruthless expert analysis engine.

Analyze the user's idea from FOUR perspectives and return ONLY a raw JSON object.
No markdown. No explanation. No code fences. Just the JSON, starting with { and ending with }.

For each perspective, identify 3-5 blind spots. Each needs:
- "title": short punchy name (max 8 words)
- "severity": exactly "high", "medium", or "low"
- "explanation": 2-3 sentences on the flaw
- "fix": 1-2 sentences on how to address it

Perspectives:
1. "investor": financial flaws, market myths, CAC/LTV, scalability
2. "devils_advocate": logical leaps, false assumptions, circular reasoning
3. "psychologist": cognitive biases (name each), overconfidence, wishful thinking
4. "lawyer": legal risks, liability, regulatory issues, worst-case scenarios

Also:
- "overall_verdict": 2-3 sentence summary
- "risk_level": "high", "medium", or "low"
- "fatal_flaws": array of up to 3 short strings

Return ONLY this JSON shape, nothing else:
{"investor":[{"title":"","severity":"","explanation":"","fix":""}],"devils_advocate":[{"title":"","severity":"","explanation":"","fix":""}],"psychologist":[{"title":"","severity":"","explanation":"","fix":""}],"lawyer":[{"title":"","severity":"","explanation":"","fix":""}],"overall_verdict":"","risk_level":"","fatal_flaws":[]}`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // ── Manually parse body (Vercel CommonJS doesn't always auto-parse) ──
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  if (!body || typeof body !== 'object') {
    body = {};
  }

  const idea = body.idea;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 20)
    return res.status(400).json({ error: 'Please provide a more detailed idea (at least a sentence).' });
  if (idea.length > 5000)
    return res.status(400).json({ error: 'Input too long. Keep it under 5000 characters.' });

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY)
    return res.status(500).json({ error: 'OPENROUTER_API_KEY is not set in Vercel environment variables.' });

  try {
    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'https://assumption-x.vercel.app',
        'X-Title': 'Blind Spot Detector'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: `Analyze this for blind spots. Return ONLY JSON:\n\n${idea.trim()}` }
        ],
        max_tokens: 3000,
        temperature: 0.7
      })
    });

    // Always read as text first — never trust .json() on external APIs
    const rawText = await orRes.text();

    if (!rawText || rawText.trim() === '') {
      return res.status(502).json({ error: 'OpenRouter returned an empty response. Free model may be rate-limited — wait a few seconds and retry.' });
    }

    // Parse the OpenRouter envelope
    let envelope;
    try {
      envelope = JSON.parse(rawText);
    } catch {
      return res.status(502).json({ error: 'OpenRouter returned non-JSON. Raw: ' + rawText.slice(0, 200) });
    }

    // OpenRouter can return an error inside a 200
    if (envelope.error) {
      return res.status(502).json({ error: 'OpenRouter: ' + (envelope.error.message || JSON.stringify(envelope.error)) });
    }

    if (!orRes.ok) {
      return res.status(502).json({ error: `OpenRouter HTTP ${orRes.status}: ${rawText.slice(0, 200)}` });
    }

    const messageContent = envelope.choices?.[0]?.message?.content || '';
    if (!messageContent.trim()) {
      return res.status(502).json({ error: 'Model returned empty content. Please try again.' });
    }

    // Strip markdown fences if model added them
    let jsonStr = messageContent.trim()
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Grab from first { to last } in case model added preamble text
    const start = jsonStr.indexOf('{');
    const end   = jsonStr.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return res.status(502).json({ error: 'Model did not return JSON. Got: ' + jsonStr.slice(0, 200) });
    }
    jsonStr = jsonStr.slice(start, end + 1);

    let parsed;
    try {
      parsed = JSON.parse(jsonStr);
    } catch (e) {
      return res.status(502).json({ error: 'JSON parse failed: ' + e.message + ' — snippet: ' + jsonStr.slice(0, 100) });
    }

    // Validate shape
    const required = ['investor', 'devils_advocate', 'psychologist', 'lawyer', 'overall_verdict', 'risk_level'];
    for (const key of required) {
      if (!(key in parsed))
        return res.status(502).json({ error: `Model response missing key: "${key}". Please retry.` });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('handler error:', err);
    return res.status(500).json({ error: err.message || 'Unexpected server error.' });
  }
};