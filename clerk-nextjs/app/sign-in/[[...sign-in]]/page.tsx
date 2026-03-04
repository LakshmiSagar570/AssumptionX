import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 40,
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(40px, 8vw, 80px)",
          letterSpacing: "0.04em",
          lineHeight: 0.9,
          color: "#f0ece0",
        }}>
          BLIND<br />SPOT<br />
          <span style={{ color: "#e63946" }}>DETECTOR</span>
        </div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          letterSpacing: "0.2em",
          color: "#666",
          textTransform: "uppercase",
          marginTop: 12,
        }}>
          Sign in to continue
        </div>
      </div>
      <SignIn routing="hash" forceRedirectUrl="/" />
    </div>
  );
}