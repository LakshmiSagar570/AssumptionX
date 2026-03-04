// api/analyze.js — Vercel Serverless Function
// Uses OpenRouter (free) — set OPENROUTER_API_KEY in Vercel Environment Variables
// Free model: meta-llama/llama-3.3-70b-instruct:free

const SYSTEM_PROMPT = `You are a Blind Spot Detector — a ruthless, expert analysis engine that identifies hidden flaws, assumptions, biases, and risks in ideas, plans, or decisions.

You will analyze the input from FOUR distinct expert perspectives and return a structured JSON response.

For each perspective, identify 3–5 distinct blind spots. Each blind spot must have:
- "title": short, punchy name of the blind spot (max 8 words)
- "severity": "high", "medium", or "low"
- "explanation": 2–3 sentences explaining the flaw, assumption, or risk in sharp, direct language
- "fix": 1–2 sentence concrete suggestion to address it

PERSPECTIVES:
1. "investor" — Skeptical Investor: market size reality checks, financial model flaws, CAC/LTV problems, competitive dynamics, scalability ceilings, revenue assumption fallacies
2. "devils_advocate" — Devil's Advocate: logical leaps, circular reasoning, false dichotomies, unfounded assumptions, "if everything goes right" thinking
3. "psychologist" — Forensic Psychologist: cognitive biases (name them explicitly), sunk cost traps, confirmation bias, overconfidence, social validation masquerading as market research, FOMO-driven decisions
4. "lawyer" — Corporate Lawyer: legal risks, regulatory issues, IP exposure, liability gaps, contract risks, worst-case edge cases that could kill the venture

Also provide:
- "overall_verdict": 2–3 sentences summarizing the most critical findings
- "risk_level": "high", "medium", or "low" overall
- "fatal_flaws": array of up to 3 short strings naming the most dangerous blind spots

Return ONLY valid JSON, no markdown fences, no preamble:
{
  "investor": [ { "title": "", "severity": "", "explanation": "", "fix": "" } ],
  "devils_advocate": [ { "title": "", "severity": "", "explanation": "", "fix": "" } ],
  "psychologist": [ { "title": "", "severity": "", "explanation": "", "fix": "" } ],
  "lawyer": [ { "title": "", "severity": "", "explanation": "", "fix": "" } ],
  "overall_verdict": "",
  "risk_level": "",
  "fatal_flaws": []
}`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Validate input
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
        'HTTP-Referer': 'https://blind-spot-detector.vercel.app',  // your Vercel URL
        'X-Title': 'Blind Spot Detector'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',  // 100% free on OpenRouter
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: `Analyze this idea/plan/decision for blind spots:\n\n${idea.trim()}` }
        ],
        max_tokens: 3000,
        temperature: 0.7,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `OpenRouter error ${response.status}`);
    }

    const data = await response.json();
    const rawText = data.choices?.[0]?.message?.content || '';

    // Parse JSON
    let parsed;
    try {
      const clean = rawText.replace(/^```json|^```|```$/gm, '').trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(502).json({ error: 'Failed to parse AI response. Please retry.' });
    }

    // Validate required keys
    const required = ['investor', 'devils_advocate', 'psychologist', 'lawyer', 'overall_verdict', 'risk_level'];
    for (const key of required) {
      if (!(key in parsed))
        return res.status(502).json({ error: `Malformed AI response (missing: ${key}). Please retry.` });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error('analyze error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error.' });
  }
}