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
- "risk_level": exactly "high", "medium", or "low"
- "fatal_flaws": array of up to 3 short strings

Return ONLY this JSON shape and nothing else:
{"investor":[{"title":"","severity":"","explanation":"","fix":""}],"devils_advocate":[{"title":"","severity":"","explanation":"","fix":""}],"psychologist":[{"title":"","severity":"","explanation":"","fix":""}],"lawyer":[{"title":"","severity":"","explanation":"","fix":""}],"overall_verdict":"","risk_level":"","fatal_flaws":[]}`;

const MODELS = [
  "openrouter/free",
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
];

const DAILY_LIMIT = 10;

// ── Supabase helpers (no SDK needed — just fetch) ─────────────────────────────
function supabaseHeaders() {
  return {
    "Content-Type": "application/json",
    "apikey": process.env.SUPABASE_ANON_KEY!,
    "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
  };
}

async function getDailyCount(userId: string): Promise<number> {
  const url = process.env.SUPABASE_URL!;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const res = await fetch(
    `${url}/rest/v1/analyses?user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${today.toISOString()}&select=id`,
    { headers: supabaseHeaders() }
  );
  if (!res.ok) return 0;
  const data = await res.json();
  return Array.isArray(data) ? data.length : 0;
}

async function saveAnalysis(userId: string, userEmail: string, idea: string, result: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL!;
  await fetch(`${url}/rest/v1/analyses`, {
    method: "POST",
    headers: { ...supabaseHeaders(), "Prefer": "return=minimal" },
    body: JSON.stringify({
      user_id: userId,
      user_email: userEmail,
      idea: idea.slice(0, 500), // store first 500 chars of idea
      result,
      risk_level: result.risk_level,
    }),
  });
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  // Auth
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user info from Clerk token
  const userId = req.headers.get("x-user-id");
  const userEmail = req.headers.get("x-user-email") || "";

  if (!userId) {
    return Response.json({ error: "User ID missing" }, { status: 401 });
  }

  // Check daily limit
  try {
    const count = await getDailyCount(userId);
    if (count >= DAILY_LIMIT) {
      return Response.json({
        error: `Daily limit reached. You've used ${count}/${DAILY_LIMIT} analyses today. Resets at midnight.`,
        limitReached: true,
        used: count,
        limit: DAILY_LIMIT,
      }, { status: 429 });
    }
  } catch {
    // If Supabase is down, allow the request through
    console.error("Supabase check failed, allowing request");
  }

  // Parse body
  let body: { idea?: string };
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const idea = body.idea;
  if (!idea || typeof idea !== "string" || idea.trim().length < 20)
    return Response.json({ error: "Please provide a more detailed idea." }, { status: 400 });
  if (idea.length > 5000)
    return Response.json({ error: "Input too long. Keep it under 5000 characters." }, { status: 400 });

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY)
    return Response.json({ error: "OPENROUTER_API_KEY not set." }, { status: 500 });

  let lastError = "";

  for (const model of MODELS) {
    try {
      const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "https://assumption-x.vercel.app",
          "X-Title": "Blind Spot Detector",
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Analyze this for blind spots. Return ONLY JSON:\n\n${idea.trim()}` },
          ],
          max_tokens: 3000,
          temperature: 0.7,
        }),
      });

      const rawText = await orRes.text();
      if (!rawText?.trim()) { lastError = `${model}: empty response`; continue; }

      let envelope: Record<string, unknown>;
      try { envelope = JSON.parse(rawText); }
      catch { lastError = `${model}: non-JSON envelope`; continue; }

      if (envelope.error) {
        const err = envelope.error as Record<string, unknown>;
        lastError = `${model}: ${err.message}`; continue;
      }

      const choices = envelope.choices as Array<Record<string, unknown>>;
      const message = choices?.[0]?.message as Record<string, unknown>;
      const content = (message?.content as string) || "";
      if (!content.trim()) { lastError = `${model}: empty content`; continue; }

      let jsonStr = content.trim()
        .replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();

      const start = jsonStr.indexOf("{");
      const end = jsonStr.lastIndexOf("}");
      if (start === -1 || end === -1) { lastError = `${model}: no JSON found`; continue; }
      jsonStr = jsonStr.slice(start, end + 1);

      let parsed: Record<string, unknown>;
      try { parsed = JSON.parse(jsonStr); }
      catch { lastError = `${model}: parse failed`; continue; }

      const required = ["investor", "devils_advocate", "psychologist", "lawyer", "overall_verdict", "risk_level"];
      const missing = required.filter((k) => !(k in parsed));
      if (missing.length) { lastError = `${model}: missing — ${missing.join(", ")}`; continue; }

      parsed._model = model;

      // Save to Supabase (non-blocking)
      saveAnalysis(userId, userEmail, idea, parsed).catch(console.error);

      return Response.json(parsed);

    } catch (err: unknown) {
      lastError = `${model}: ${err instanceof Error ? err.message : "unknown"}`;
      continue;
    }
  }

  return Response.json({ error: `All models failed. Last: ${lastError}` }, { status: 502 });
}