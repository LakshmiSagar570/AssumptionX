const SYSTEM_PROMPT = `You are a Blind Spot Detector — a critical thinking expert who analyzes ideas objectively.

Analyze the user's idea from FOUR perspectives. Your risk assessment MUST be calibrated:
- "high" risk: idea has fundamental flaws that would likely cause failure (illegal, no market, zero capital, completely unrealistic)
- "medium" risk: idea has real challenges but is viable with the right approach (most solid business ideas fall here)
- "low" risk: idea is well-thought-out with manageable risks (rare, only for very solid plans)

DO NOT default everything to "high". Be fair and accurate. A person quitting their job with savings to freelance is "medium", not "high". Buying crypto with borrowed money is "high".

Return ONLY a raw JSON object. No markdown. No explanation. No code fences. Just JSON starting with { and ending with }.

For each perspective, identify 3-5 blind spots. Each needs:
- "title": short punchy name (max 8 words)
- "severity": exactly "high", "medium", or "low"
- "explanation": 2-3 sentences on the flaw
- "fix": 1-2 actionable sentences on how to address it

Perspectives:
1. "investor": financial flaws, market size myths, CAC/LTV, revenue model, scalability
2. "devils_advocate": logical leaps, false assumptions, circular reasoning, ignored competition
3. "psychologist": cognitive biases (name each specifically), overconfidence, wishful thinking
4. "lawyer": legal risks, regulatory issues, liability, worst-case scenarios

Also return:
- "overall_verdict": 3-4 balanced sentences acknowledging strengths AND weaknesses
- "risk_level": exactly "high", "medium", or "low"
- "fatal_flaws": array of 1-3 short strings, only genuinely fatal issues. Empty array [] if none.

Return ONLY this exact JSON shape and nothing else:
{"investor":[{"title":"","severity":"","explanation":"","fix":""}],"devils_advocate":[{"title":"","severity":"","explanation":"","fix":""}],"psychologist":[{"title":"","severity":"","explanation":"","fix":""}],"lawyer":[{"title":"","severity":"","explanation":"","fix":""}],"overall_verdict":"","risk_level":"","fatal_flaws":[]}`;

const MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "meta-llama/llama-3.1-8b-instruct:free",
  "mistralai/mistral-7b-instruct:free",
  "google/gemma-3-4b-it:free",
  "openrouter/free",
];

const DAILY_LIMIT = 10;

// ── Supabase ──────────────────────────────────────────────────────────────────
function sbHeaders() {
  return {
    "Content-Type": "application/json",
    "apikey": process.env.SUPABASE_ANON_KEY!,
    "Authorization": `Bearer ${process.env.SUPABASE_ANON_KEY!}`,
  };
}

async function getDailyCount(userId: string): Promise<number> {
  try {
    const url = process.env.SUPABASE_URL;
    if (!url || !process.env.SUPABASE_ANON_KEY) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const res = await fetch(
      `${url}/rest/v1/analyses?user_id=eq.${encodeURIComponent(userId)}&created_at=gte.${today.toISOString()}&select=id`,
      { headers: sbHeaders() }
    );
    if (!res.ok) return 0;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch { return 0; }
}

async function saveAnalysis(
  userId: string,
  userEmail: string,
  idea: string,
  result: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  try {
    const url = process.env.SUPABASE_URL;
    if (!url || !process.env.SUPABASE_ANON_KEY) {
      return { ok: false, error: "Supabase env vars not set" };
    }

    const payload = {
      user_id: userId,
      user_email: userEmail,
      idea: idea.slice(0, 500),
      result,
      risk_level: String(result.risk_level || "medium"),
    };

    const res = await fetch(`${url}/rest/v1/analyses`, {
      method: "POST",
      headers: { ...sbHeaders(), "Prefer": "return=minimal" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      return { ok: false, error: `Supabase ${res.status}: ${text}` };
    }
    return { ok: true };
  } catch (e: unknown) {
    return { ok: false, error: e instanceof Error ? e.message : "unknown" };
  }
}

// ── Model caller with retry ───────────────────────────────────────────────────
async function tryModel(
  model: string,
  idea: string,
  apiKey: string
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://assumption-x.vercel.app",
        "X-Title": "Blind Spot Detector",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Analyze this idea for blind spots. Be balanced in risk assessment. Return ONLY JSON:\n\n${idea.trim()}`,
          },
        ],
        max_tokens: 3000,
        temperature: 0.6,
      }),
    });

    if (!res.ok) return null;

    const rawText = await res.text();
    if (!rawText?.trim()) return null;

    let envelope: Record<string, unknown>;
    try { envelope = JSON.parse(rawText); } catch { return null; }

    if (envelope.error) return null;

    const choices = envelope.choices as Array<Record<string, unknown>>;
    const message = choices?.[0]?.message as Record<string, unknown>;
    const content = (message?.content as string) || "";
    if (!content.trim()) return null;

    let jsonStr = content.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const start = jsonStr.indexOf("{");
    const end = jsonStr.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    jsonStr = jsonStr.slice(start, end + 1);

    let parsed: Record<string, unknown>;
    try { parsed = JSON.parse(jsonStr); } catch { return null; }

    const required = ["investor", "devils_advocate", "psychologist", "lawyer", "overall_verdict", "risk_level"];
    if (required.some((k) => !(k in parsed))) return null;

    if (!["high", "medium", "low"].includes(parsed.risk_level as string)) {
      parsed.risk_level = "medium";
    }
    if (!Array.isArray(parsed.fatal_flaws)) parsed.fatal_flaws = [];

    return parsed;
  } catch {
    return null;
  }
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = req.headers.get("x-user-id") || "";
  const userEmail = req.headers.get("x-user-email") || "";

  if (!userId) {
    return Response.json({ error: "User ID missing." }, { status: 401 });
  }

  let body: { idea?: string };
  try { body = await req.json(); }
  catch { return Response.json({ error: "Invalid request body." }, { status: 400 }); }

  const idea = body.idea;
  if (!idea || typeof idea !== "string" || idea.trim().length < 20) {
    return Response.json({ error: "Please describe your idea in more detail." }, { status: 400 });
  }
  if (idea.length > 5000) {
    return Response.json({ error: "Input too long. Keep it under 5000 characters." }, { status: 400 });
  }

  const usedToday = await getDailyCount(userId);
  if (usedToday >= DAILY_LIMIT) {
    return Response.json({
      error: `Daily limit reached. You've used ${usedToday}/${DAILY_LIMIT} analyses today. Come back tomorrow.`,
      limitReached: true,
      used: usedToday,
      limit: DAILY_LIMIT,
    }, { status: 429 });
  }

  const API_KEY = process.env.OPENROUTER_API_KEY;
  if (!API_KEY) return Response.json({ error: "Server configuration error." }, { status: 500 });

  // Try each model — each model gets 2 attempts before moving on
  for (const model of MODELS) {
    let result = await tryModel(model, idea, API_KEY);
    if (!result) {
      // One retry on same model before moving to next
      await new Promise(r => setTimeout(r, 1000));
      result = await tryModel(model, idea, API_KEY);
    }
    if (result) {
      // Save to DB — now we await it and log the outcome
      const saveResult = await saveAnalysis(userId, userEmail, idea, result);
      if (!saveResult.ok) {
        console.error(`[History Save Failed] userId=${userId} error=${saveResult.error}`);
      }

      delete result._model;
      return Response.json(result);
    }
  }

  return Response.json({
    error: "AI models are busy right now. Please wait 30 seconds and try again.",
  }, { status: 502 });
}