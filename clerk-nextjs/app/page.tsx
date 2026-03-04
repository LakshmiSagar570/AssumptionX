"use client";

import { useState, useRef } from "react";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";

// ── Types ────────────────────────────────────────────────────────────────────
type BlindSpot = {
  title: string;
  severity: string;
  explanation: string;
  fix: string;
};

type AnalysisResult = {
  investor: BlindSpot[];
  devils_advocate: BlindSpot[];
  psychologist: BlindSpot[];
  lawyer: BlindSpot[];
  overall_verdict: string;
  risk_level: string;
  fatal_flaws: string[];
  _model?: string;
};

// ── Constants ────────────────────────────────────────────────────────────────
const LENSES = [
  { id: "investor",        icon: "💰", name: "Skeptical Investor",    role: "Market & Financial Viability" },
  { id: "devils_advocate", icon: "👿", name: "Devil's Advocate",      role: "Logic & Assumptions" },
  { id: "psychologist",    icon: "🧠", name: "Forensic Psychologist", role: "Cognitive Biases & Emotional Blindspots" },
  { id: "lawyer",          icon: "⚖️", name: "Corporate Lawyer",      role: "Risk, Liability & Edge Cases" },
];

const STEPS = [
  "💰 Skeptical Investor analyzing financials...",
  "👿 Devil's Advocate attacking assumptions...",
  "🧠 Psychologist detecting cognitive biases...",
  "⚖️ Lawyer reviewing legal exposure...",
  "📋 Compiling case file...",
];

// ── Color palette ────────────────────────────────────────────────────────────
const C = {
  bg:         "#0a0a0a",
  surface:    "#111111",
  border:     "#1e1e1e",
  bright:     "#2e2e2e",
  red:        "#e63946",
  amber:      "#f4a026",
  teal:       "#2ec4b6",
  green:      "#57cc99",
  dim:        "#444444",
  muted:      "#666666",
  text:       "#d4d0c8",
  textBright: "#f0ece0",
};

function riskColor(r: string) { return r === "high" ? C.red : r === "medium" ? C.amber : C.green; }
function riskWidth(r: string) { return r === "high" ? "100%" : r === "medium" ? "60%" : "25%"; }
function sevColor(s: string)  { return s === "high" ? C.red : s === "medium" ? C.amber : C.green; }
function sevLabel(s: string)  { return s === "high" ? "🔴 CRITICAL" : s === "medium" ? "🟠 MODERATE" : "🟢 MINOR"; }

// ── Auth Wall ────────────────────────────────────────────────────────────────
function AuthWall() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40, padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px,9vw,96px)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.textBright }}>
          BLIND<br />SPOT<br /><span style={{ color: C.red }}>DETECTOR</span>
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", marginTop: 12 }}>
          Sign in to continue
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
        <a href="/sign-in?redirect_url=/" style={{ textDecoration: "none" }}>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "14px 24px", background: "#fff", color: "#1a1a1a", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </a>

        <a href="/sign-in?redirect_url=/" style={{ textDecoration: "none" }}>
          <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, width: "100%", padding: "14px 24px", background: "#24292e", color: "#fff", border: "1px solid #444", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, fontWeight: 500 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </a>
      </div>

      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.15em", color: C.dim, textTransform: "uppercase" }}>
        Your analyses are private and encrypted
      </div>
    </div>
  );
}

// ── Main App (only rendered when signed in) ───────────────────────────────────
function App() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const [idea, setIdea]             = useState("");
  const [loading, setLoading]       = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [error, setError]           = useState("");
  const [result, setResult]         = useState<AnalysisResult | null>(null);
  const [openSpots, setOpenSpots]   = useState<Set<string>>(new Set());
  const [copied, setCopied]         = useState(false);
  const stepTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function startSteps() {
    setActiveStep(0);
    let cur = 0;
    stepTimer.current = setInterval(() => {
      cur++;
      if (cur < STEPS.length) setActiveStep(cur);
    }, 2200);
  }

  function stopSteps() {
    if (stepTimer.current) clearInterval(stepTimer.current);
    setActiveStep(-1);
  }

  async function runAnalysis() {
    if (idea.trim().length < 20) { setError("Please describe your idea in more detail."); return; }
    setError(""); setResult(null); setLoading(true);
    startSteps();
    try {
      const token = await getToken();
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      stopSteps();
      setResult(data as AnalysisResult);
    } catch (err: unknown) {
      stopSteps();
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSpot(id: string) {
    setOpenSpots((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function copyReport() {
    if (!result) return;
    const lines: string[] = ["BLIND SPOT DETECTOR — REPORT", "=".repeat(50), ""];
    lines.push(`RISK: ${result.risk_level.toUpperCase()}`);
    lines.push(`FATAL FLAWS: ${result.fatal_flaws?.join(", ") || "None"}\n`);
    LENSES.forEach((l) => {
      lines.push(`--- ${l.name.toUpperCase()} ---`);
      const spots = result[l.id as keyof AnalysisResult] as BlindSpot[];
      spots?.forEach((s, i) => {
        lines.push(`${i + 1}. [${s.severity.toUpperCase()}] ${s.title}`);
        lines.push(`   ${s.explanation}`);
        lines.push(`   FIX: ${s.fix}\n`);
      });
    });
    lines.push("--- FINAL VERDICT ---\n" + (result.overall_verdict || ""));
    navigator.clipboard.writeText(lines.join("\n")).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const allSpots = result
    ? LENSES.flatMap((l) => (result[l.id as keyof AnalysisResult] as BlindSpot[]) || [])
    : [];
  const counts = { high: 0, medium: 0, low: 0 };
  allSpots.forEach((s) => { counts[s.severity as keyof typeof counts]++; });
  const risk = result?.risk_level ?? "medium";

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}>

      {/* Grid texture */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.bright}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em", color: C.textBright }}>
          BLIND <span style={{ color: C.red }}>SPOT</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.muted }}>
            {user?.primaryEmailAddress?.emailAddress ?? user?.username ?? ""}
          </span>
          <UserButton />
        </div>
      </nav>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "60px 24px 120px" }}>

        {/* Header */}
        <header style={{ marginBottom: 64 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.25em", color: C.red, textTransform: "uppercase", marginBottom: 10 }}>
            Single Agent Architecture
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px,9vw,96px)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.textBright, marginBottom: 12 }}>
            BLIND<br />SPOT<br /><span style={{ color: C.red }}>DETECTOR</span>
          </h1>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 520 }}>
            Submit your idea, plan, or decision. Four expert lenses will systematically dismantle it and surface every hidden flaw you missed.
          </p>
        </header>

        {/* Input */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", marginBottom: 12 }}>
            Your Idea / Plan / Decision
          </div>
          <textarea
            value={idea}
            maxLength={5000}
            onChange={(e) => setIdea(e.target.value)}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") runAnalysis(); }}
            placeholder={`Describe your business idea, life decision, or plan...\n\ne.g. "I want to quit my job and start a SaaS for freelancers..."`}
            style={{ width: "100%", minHeight: 180, background: C.surface, border: `1px solid ${C.bright}`, borderTop: `2px solid ${C.teal}`, color: C.textBright, fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.7, padding: "20px 24px", resize: "vertical", outline: "none" }}
          />
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.dim, textAlign: "right", marginTop: 6 }}>
            {idea.length} / 5000
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.dim }}>// Ctrl + Enter to analyze</span>
            <button
              disabled={loading}
              onClick={runAnalysis}
              style={{ background: loading ? C.dim : C.red, color: "#fff", border: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.12em", padding: "14px 40px", cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? "ANALYZING..." : "DETECT BLIND SPOTS"}
            </button>
          </div>
        </div>

        {/* Loading steps */}
        {loading && (
          <div style={{ marginTop: 32, border: `1px solid ${C.bright}`, borderLeft: `3px solid ${C.teal}`, background: C.surface, padding: "20px 24px" }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.2em", color: C.teal, textTransform: "uppercase", marginBottom: 16 }}>
              // Analysis in progress
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STEPS.map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: i < activeStep ? C.teal : i === activeStep ? C.textBright : C.dim, transition: "color 0.3s" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: i < activeStep ? C.teal : i === activeStep ? C.amber : C.dim }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.3)", borderLeft: `3px solid ${C.red}`, padding: "14px 20px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.red, marginTop: 24, lineHeight: 1.6 }}>
            // ERROR: {error}
          </div>
        )}

        {/* Results */}
        {result !== null && (
          <div style={{ marginTop: 60 }}>

            {/* Results header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 32, paddingBottom: 16, borderBottom: `1px solid ${C.bright}`, flexWrap: "wrap", gap: 12 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, letterSpacing: "0.06em", color: C.textBright }}>CASE FILE OPENED</div>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "6px 14px", border: `1px solid ${riskColor(risk)}`, color: riskColor(risk), background: `${riskColor(risk)}14`, fontWeight: 500 }}>
                  {risk.toUpperCase()} RISK
                </div>
                <button
                  onClick={copyReport}
                  style={{ background: "transparent", color: copied ? C.teal : C.muted, border: `1px solid ${copied ? C.teal : C.bright}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 14px", cursor: "pointer" }}
                >
                  {copied ? "✅ COPIED" : "📋 COPY REPORT"}
                </button>
              </div>
            </div>

            {/* Stats + risk meter */}
            <div style={{ background: C.surface, border: `1px solid ${C.bright}`, borderTop: `2px solid ${C.red}`, padding: "24px 28px", marginBottom: 40, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {([ ["Total", allSpots.length, C.red], ["🔴 Critical", counts.high, C.red], ["🟠 Moderate", counts.medium, C.amber], ["🟢 Minor", counts.low, C.green] ] as [string, number, string][]).map(([label, val, color]) => (
                    <div key={label}>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, lineHeight: 1, color }}>{val}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.18em", color: C.muted, textTransform: "uppercase" }}>{label}</div>
                    </div>
                  ))}
                </div>
                {result.fatal_flaws?.length > 0 && (
                  <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Fatal Flaws</div>
                    {result.fatal_flaws.map((f, i) => (
                      <div key={i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.red, marginBottom: 4 }}>→ {f}</div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 10 }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>Overall Risk Level</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.08em", color: riskColor(risk) }}>{risk.toUpperCase()}</div>
                <div style={{ height: 8, background: C.border }}>
                  <div style={{ height: "100%", width: riskWidth(risk), background: riskColor(risk), transition: "width 1s ease" }} />
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.dim, marginTop: 6 }}>
                  {risk === "high" ? "Significant risks. Address before proceeding." : risk === "medium" ? "Moderate risks. Fixable with the right approach." : "Low risk. Proceed with awareness."}
                </div>
              </div>
            </div>

            {/* Lenses */}
            {LENSES.map((lens) => {
              const spots = (result[lens.id as keyof AnalysisResult] as BlindSpot[]) ?? [];
              return (
                <div key={lens.id} style={{ marginBottom: 48 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                    <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, border: `1px solid ${C.bright}`, flexShrink: 0 }}>{lens.icon}</div>
                    <div>
                      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: "0.08em", color: C.textBright }}>{lens.name}</div>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase" }}>{lens.role}</div>
                    </div>
                  </div>
                  {spots.map((spot, si) => {
                    const id = `${lens.id}-${si}`;
                    const open = openSpots.has(id);
                    return (
                      <div key={id} style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${sevColor(spot.severity)}`, marginBottom: 12, overflow: "hidden" }}>
                        <div onClick={() => toggleSpot(id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", background: C.surface, cursor: "pointer", userSelect: "none" }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: sevColor(spot.severity), flexShrink: 0 }} />
                          <div style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.textBright }}>{spot.title}</div>
                          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: sevColor(spot.severity), border: `1px solid ${sevColor(spot.severity)}44`, padding: "3px 8px", whiteSpace: "nowrap" }}>
                            {sevLabel(spot.severity)}
                          </div>
                          <div style={{ color: C.muted, fontSize: 12, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s", flexShrink: 0 }}>▼</div>
                        </div>
                        {open && (
                          <div style={{ padding: "0 20px 20px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", margin: "16px 0 6px" }}>Analysis</div>
                            <div style={{ fontSize: 14, lineHeight: 1.75, color: C.text }}>{spot.explanation}</div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", margin: "16px 0 6px" }}>How to Address It</div>
                            <div style={{ fontSize: 14, lineHeight: 1.75, color: C.teal, fontStyle: "italic" }}>{spot.fix}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {/* Final verdict */}
            <div style={{ border: `1px solid ${C.bright}`, padding: 28, marginTop: 40, position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: 28, background: C.bg, fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.25em", color: C.muted, padding: "0 8px" }}>
                FINAL VERDICT
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text, marginTop: 8 }}>{result.overall_verdict}</div>
              {result._model && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.dim, marginTop: 16 }}>// analyzed by {result._model}</div>
              )}
            </div>

            <button
              onClick={() => { setResult(null); setIdea(""); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              style={{ background: "transparent", color: C.muted, border: `1px solid ${C.bright}`, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", padding: "10px 20px", cursor: "pointer", marginTop: 32 }}
            >
              ← ANALYZE ANOTHER IDEA
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, letterSpacing: "0.2em", color: "#444", textTransform: "uppercase" }}>
          Loading...
        </div>
      </div>
    );
  }

  return isSignedIn ? <App /> : <AuthWall />;
}