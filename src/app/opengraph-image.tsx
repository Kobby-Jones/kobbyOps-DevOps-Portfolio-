import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Cobbina Emmanuel, Software and Cloud Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "white",
          background: "radial-gradient(circle at 82% 10%, rgba(20,184,166,.28), transparent 32%), linear-gradient(135deg, #09090b, #111827)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", color: "#5eead4", background: "rgba(20,184,166,.12)", border: "1px solid rgba(94,234,212,.35)", fontSize: 27, fontWeight: 700 }}>CE</div>
          <div style={{ display: "flex", flexDirection: "column" }}><span style={{ fontSize: 28, fontWeight: 700 }}>Cobbina Emmanuel</span><span style={{ color: "#94a3b8", fontSize: 20, marginTop: 6 }}>KobbyOps · Ghana</span></div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 950 }}>
          <span style={{ color: "#5eead4", fontSize: 20, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase" }}>Software & Cloud Engineer</span>
          <span style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.08, marginTop: 22, letterSpacing: -2 }}>Secure software. Reliable cloud platforms. Clear engineering.</span>
        </div>
        <div style={{ display: "flex", gap: 28, color: "#a1a1aa", fontSize: 18 }}><span>AWS</span><span>Backend systems</span><span>DevOps</span><span>Platform engineering</span></div>
      </div>
    ),
    size,
  );
}
