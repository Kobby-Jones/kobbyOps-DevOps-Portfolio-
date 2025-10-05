"use client";
import { useEffect, useRef, useState } from "react";

const nowFmt = () =>
  new Date().toLocaleString("en-GB", { hour12: false });

const categories = [
  { tag: "INFO", color: "text-zinc-400" },
  { tag: "DEPLOY", color: "text-emerald-400" },
  { tag: "ACHV", color: "text-sky-400" },
  { tag: "CERT", color: "text-amber-400" },
  { tag: "ERROR", color: "text-rose-400" },
];

// Example static events to start the feed
const initialLogs = [
  `${nowFmt()}  INFO  KobbyOps system started.`,
  `${nowFmt()}  ACHV  Joined Amalitech Cloud Engineering Cohort ☁️`,
  `${nowFmt()}  DEPLOY  Deployed PrepGo v2.0 successfully ✅`,
  `${nowFmt()}  CERT  AWS Certified Solutions Architect scheduled 📅`,
];

export default function Logs() {
  const [logs, setLogs] = useState(initialLogs);
  const [streaming, setStreaming] = useState(true);
  const tailRef = useRef<HTMLDivElement | null>(null);

  // Simulated log generation
  useEffect(() => {
    if (!streaming) return;
    const interval = setInterval(() => {
      const randomEvents = [
        `INFO  Running system diagnostics... all green.`,
        `DEPLOY  Auto-scaling enabled for EVote cluster.`,
        `ACHV  Completed Flutter microservice optimization.`,
        `CERT  Completed Jenkins CI/CD Masterclass.`,
        `ERROR  Temporary failure in Docker registry connection.`,
        `DEPLOY  POS Suite updated with new analytics module.`,
        `ACHV  Published research paper on GNN recommender systems.`,
        `INFO  Monitoring uptime — 99.99% sustained.`,
      ];
      const entry = randomEvents[Math.floor(Math.random() * randomEvents.length)];
      setLogs((l) => [`${nowFmt()}  ${entry}`, ...l.slice(0, 80)]); // keep top 80
    }, 3500);
    return () => clearInterval(interval);
  }, [streaming]);

  // Auto-scroll effect
  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const parseLog = (line: string) => {
    const tag = categories.find((c) => line.includes(c.tag));
    const color = tag ? tag.color : "text-zinc-300";
    return <span className={color}>{line}</span>;
  };

  const clearLogs = () => setLogs([]);
  const toggleStream = () => setStreaming((s) => !s);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-zinc-300 font-medium mb-2">📜 System Logs</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleStream}
            className={`text-xs ${
              streaming ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
            } text-white px-3 py-1 rounded-lg transition`}
          >
            {streaming ? "Pause Stream" : "Resume Stream"}
          </button>
          <button
            onClick={clearLogs}
            className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded-lg transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="font-medium text-zinc-200 mb-2">
          tail -f /var/log/kobby/ops.log
        </div>

        <div className="font-mono text-xs bg-black/50 text-zinc-300 rounded-xl p-3 h-[480px] overflow-auto">
          {[...logs].reverse().map((line, idx) => (
            <div key={idx} className="whitespace-pre">
              {parseLog(line)}
            </div>
          ))}
          <div ref={tailRef} />
        </div>
      </div>

      <div className="text-xs text-zinc-500 text-center">
        KobbyOps Logger v1.2.1 — <span className="text-emerald-400">Streaming {logs.length}</span> entries.
      </div>
    </div>
  );
}
