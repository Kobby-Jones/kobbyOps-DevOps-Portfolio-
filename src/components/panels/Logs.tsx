"use client";
import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Cloud,
  CheckCircle,
  Calendar,
  Info,
  Rocket,
  Award,
  AlertTriangle,
} from "lucide-react";

const nowFmt = () =>
  new Date().toLocaleString("en-GB", { hour12: false });

const categories = [
  { tag: "INFO", color: "text-zinc-400", icon: <Info size={12} className="text-zinc-400" /> },
  { tag: "DEPLOY", color: "text-emerald-400", icon: <Rocket size={12} className="text-emerald-400" /> },
  { tag: "ACHV", color: "text-sky-400", icon: <Award size={12} className="text-sky-400" /> },
  { tag: "CERT", color: "text-amber-400", icon: <Calendar size={12} className="text-amber-400" /> },
  { tag: "ERROR", color: "text-rose-400", icon: <AlertTriangle size={12} className="text-rose-400" /> },
];

const initialLogs = [
  `${nowFmt()}  INFO  KobbyOps system started.`,
  `${nowFmt()}  ACHV  Joined Amalitech Cloud Engineering Cohort`,
  `${nowFmt()}  DEPLOY  Deployed PrepGo v2.0 successfully`,
  `${nowFmt()}  CERT  AWS Certified Solutions Architect scheduled`,
];

export default function Logs() {
  const [logs, setLogs] = useState(initialLogs);
  const [streaming, setStreaming] = useState(true);
  const tailRef = useRef<HTMLDivElement | null>(null);

// WebSocket-style polling of logs API (every few seconds)
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/webhook/github");
      const data = await res.json();
      if (Array.isArray(data.logs)) setLogs(data.logs);
    }, 5000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const parseLog = (line: string) => {
    const category = categories.find((c) => line.includes(c.tag));
    const color = category ? category.color : "text-zinc-300";
    const icon = category ? category.icon : <FileText size={12} className="text-zinc-500" />;

    return (
      <div className={`flex items-center gap-2 ${color}`}>
        {icon}
        <span>{line}</span>
      </div>
    );
  };

  const clearLogs = () => setLogs([]);
  const toggleStream = () => setStreaming((s) => !s);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-zinc-300 font-medium mb-2 flex items-center gap-2">
          <FileText className="text-teal-400" size={18} />
          System Logs
        </h2>
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

      {/* Log Output */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="font-medium text-zinc-200 mb-2">
          tail -f /var/log/kobby/ops.log
        </div>

        <div className="font-mono text-xs bg-black/50 text-zinc-300 rounded-xl p-3 h-[480px] overflow-auto space-y-1">
          {[...logs].reverse().map((line, idx) => (
            <div key={idx}>{parseLog(line)}</div>
          ))}
          <div ref={tailRef} />
        </div>
      </div>

      <div className="text-xs text-zinc-500 text-center">
        KobbyOps Logger v1.2.1 —{" "}
        <span className="text-emerald-400">Streaming {logs.length}</span> entries.
      </div>
    </div>
  );
}
