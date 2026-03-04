// api/analyze.js — Vercel Serverless Function
// Uses OpenRouter free tier — set OPENROUTER_API_KEY in Vercel Environment Variables

const SYSTEM_PROMPT = `You are a Blind Spot Detector — a ruthless expert analysis engine.

Analyze the user's idea from FOUR perspectives and return ONLY a raw JSON object.
No markdown. No explanation. No code fences. Just the JSON object, starting with { and ending with }.

For each perspective, identify 3-5 blind spots. Each blind spot needs:
- "title": short punchy name (max 8 words)
- "severity": exactly one of: "high", "medium", or "low"
- "explanation": 2-3 sentences explaining the flaw clearly
- "fix": 1-2 sentences on how to address it

The four perspectives are:
1. "investor" — Skeptical Investor: financial flaws, market size myths, CAC/LTV, competition, scalability
2. "devils_advocate" — Devil's Advocate: logical leaps, false assumptions, circular reasoning
3. "psychologist" — Forensic Psychologist: cognitive biases (name each one), overconfidence, wishful thinking
4. "lawyer" — Corporate Lawyer: legal risks, liability, regulatory issues, worst-case scenarios

Also include:
- "overall_verdict": 2-3 sentence summary of the most critical findings
- "risk_level": exactly one of: "high", "medium", or "low"
- "fatal_flaws": array of up to 3 short strings

Your entire response must be this exact JSON shape and nothing else:
{"investor":[{"title":"","severity":"","explanation":"","fix":""}],"devils_advocate":[{"title":"","severity":"","explanation":"","fix":""}],"psychologist":[{"title":"","severity":"","explanation":"","fix":""}],"lawyer":[{"title":"","severity":"","explanation":"","fix":""}],"overall_verdict":"","risk_level":"","fatal_flaws":[]}`;

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { idea } = req.body || {};
  if (!idea || typeof idea !== 'string' || idea.trim().length < 20)
    return res.status(400).json({ error: 'Please provide a more detailed idea.' });
  if (idea.length > 5000)
    return res.status(400).json({ error: 'Input too long. Keep it under 5000 characters.' });

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY)
    return res.status(500).json({ error: 'Server misconfiguration: OPENROUTER_API_KEY not set.' });

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': req.headers.origin || 'https://blind-spot-detector.vercel.app',
        'X-Title': 'Blind Spot Detector'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: `Analyze this for blind spots and return ONLY JSON:\n\n${idea.trim()}` }
        ],
        max_tokens: 3000,
        temperature: 0.7
        // NOTE: response_format removed — not supported by all free models
      })
    });

    // Read raw text first — never call .json() directly on OpenRouter responses
    const rawText = await response.text();

    // Check for HTTP error
    if (!response.ok) {
      let errMsg = `OpenRouter error ${response.status}`;
      try { errMsg = JSON.parse(rawText)?.error?.message || errMsg; } catch {}
      return res.status(502).json({ error: errMsg });
    }

    // Check for empty body
    if (!rawText || rawText.trim() === '') {
      return res.status(502).json({ error: 'OpenRouter returned an empty response. The free model may be overloaded — please try again in a few seconds.' });
    }

    // Extract the message content from OpenRouter envelope
    let messageContent = '';
    try {
      const envelope = JSON.parse(rawText);

      // Check for API-level error inside a 200 response (OpenRouter does this)
      if (envelope.error) {
        return res.status(502).json({ error: envelope.error.message || 'OpenRouter returned an error.' });
      }

      messageContent = envelope.choices?.[0]?.message?.content || '';
    } catch {
      return res.status(502).json({ error: 'Could not parse OpenRouter envelope. Please retry.' });
    }

    if (!messageContent || messageContent.trim() === '') {
      return res.status(502).json({ error: 'Model returned empty content. Please try again.' });
    }

    // Extract JSON from the message (strip any accidental markdown fences)
    let jsonString = messageContent.trim();
    // Remove ```json ... ``` or ``` ... ``` if model wrapped it anyway
    jsonString = jsonString.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
    // Find first { and last } to extract JSON even if model added preamble text
    const start = jsonString.indexOf('{');
    const end   = jsonString.lastIndexOf('}');
    if (start === -1 || end === -1) {
      return res.status(502).json({ error: 'Model did not return valid JSON. Please retry.' });
    }
    jsonString = jsonString.slice(start, end + 1);

    // Parse final JSON
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      return res.status(502).json({ error: 'Failed to parse model response as JSON. Please retry.' });
    }

    // Validate required keys
    const required = ['investor', 'devils_advocate', 'psychologist', 'lawyer', 'overall_verdict', 'risk_level'];
    for (const key of required) {
      if (!(key in parsed))
        return res.status(502).json({ error: `Incomplete response from model (missing: ${key}). Please retry.` });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('analyze handler error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}