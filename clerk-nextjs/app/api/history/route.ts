"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

const C = {
  bg: "#0a0a0a", surface: "#111111", border: "#1e1e1e", bright: "#2e2e2e",
  red: "#e63946", amber: "#f4a026", teal: "#2ec4b6", green: "#57cc99",
  dim: "#444444", muted: "#666666", text: "#d4d0c8", textBright: "#f0ece0",
};

type Analysis = {
  id: string;
  idea: string;
  risk_level: string;
  created_at: string;
  result: Record<string, unknown>;
};

const rc = (r: string) => r === "high" ? C.red : r === "medium" ? C.amber : C.green;

export default function HistoryPage() {
  const { user, isLoaded }      = useUser();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetch(`/api/history?userId=${encodeURIComponent(user.id)}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAnalyses(data);
        } else {
          console.error("History API returned:", data);
          setAnalyses([]);
        }
        setLoading(false);
      })
      .catch((e) => { console.error("History fetch error:", e); setLoading(false); });
  }, [isLoaded, user]);

  if (!isLoaded || !user) return null;

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", fontWeight: 300 }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)`, backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0 }} />

      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(10,10,10,0.95)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.bright}`, padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: "0.1em", color: C.textBright }}>
            BLIND <span style={{ color: C.red }}>SPOT</span>
          </div>
        </Link>
        <Link href="/" style={{ textDecoration: "none", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.15em", color: C.muted, textTransform: "uppercase", border: `1px solid ${C.bright}`, padding: "6px 14px" }}>
          ← New Analysis
        </Link>
      </nav>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "60px 24px 120px" }}>
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.25em", color: C.red, textTransform: "uppercase", marginBottom: 10 }}>Case Archives</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px,7vw,72px)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.textBright }}>
            YOUR<br />HISTORY
          </h1>
        </div>

        {loading && (
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: C.dim, letterSpacing: "0.1em" }}>// Loading analyses...</div>
        )}

        {!loading && analyses.length === 0 && (
          <div style={{ border: `1px solid ${C.bright}`, padding: "40px 28px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: C.muted, letterSpacing: "0.06em" }}>No analyses yet</div>
            <div style={{ fontSize: 13, color: C.dim, marginTop: 8 }}>Run your first analysis to see it here</div>
            <Link href="/"><button style={{ marginTop: 20, background: C.red, color: "#fff", border: "none", fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: "0.1em", padding: "12px 28px", cursor: "pointer" }}>START ANALYZING</button></Link>
          </div>
        )}

        {!loading && analyses.map((a) => {
          const isOpen = expanded === a.id;
          const date = new Date(a.created_at);
          const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
          const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={a.id} style={{ border: `1px solid ${C.border}`, borderLeft: `3px solid ${rc(a.risk_level)}`, marginBottom: 12, overflow: "hidden" }}>
              <div onClick={() => setExpanded(isOpen ? null : a.id)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", background: C.surface, cursor: "pointer", userSelect: "none" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: rc(a.risk_level), flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: C.textBright, fontWeight: 500 }}>{a.idea}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: C.dim, marginTop: 4 }}>{dateStr} · {timeStr}</div>
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: rc(a.risk_level), border: `1px solid ${rc(a.risk_level)}44`, padding: "3px 8px", whiteSpace: "nowrap" }}>{a.risk_level} risk</div>
                <div style={{ color: C.muted, fontSize: 12, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
              </div>
              {isOpen && (
                <div style={{ padding: "20px 24px", background: C.surface, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Final Verdict</div>
                  <div style={{ fontSize: 14, lineHeight: 1.75, color: C.text }}>{(a.result?.overall_verdict as string) || "—"}</div>
                  {(a.result?.fatal_flaws as string[])?.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: C.muted, textTransform: "uppercase", marginBottom: 8 }}>Fatal Flaws</div>
                      {(a.result.fatal_flaws as string[]).map((f, i) => (
                        <div key={i} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.red, marginBottom: 4 }}>→ {f}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}