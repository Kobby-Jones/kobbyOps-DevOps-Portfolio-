"use client";
import { JSX, useEffect, useState } from "react";
import {
  FileText,
  Cloud,
  Rocket,
  Award,
  Calendar,
  AlertTriangle,
  Info,
} from "lucide-react";

// Map event type to icons and colors
const categoryConfig: Record<
  string,
  { icon: JSX.Element; color: string }
> = {
  push: {
    icon: <Rocket size={12} className="text-emerald-400" />,
    color: "text-emerald-400",
  },
  "workflow_run": {
    icon: <Cloud size={12} className="text-sky-400" />,
    color: "text-sky-400",
  },
  "create": {
    icon: <Award size={12} className="text-amber-400" />,
    color: "text-amber-400",
  },
  "error": {
    icon: <AlertTriangle size={12} className="text-rose-400" />,
    color: "text-rose-400",
  },
  "info": {
    icon: <Info size={12} className="text-zinc-400" />,
    color: "text-zinc-400",
  },
  default: {
    icon: <FileText size={12} className="text-zinc-500" />,
    color: "text-zinc-300",
  },
};

interface LogEntry {
  id: number;
  event_type: string;
  message: string;
  created_at: string;
}

export default function Logs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(true);

  // Fetch logs periodically (simulating live tail)
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/webhook/github");
        const data = await res.json();
        if (Array.isArray(data.logs)) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error("❌ Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    if (streaming) {
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [streaming]);

  const clearLogs = () => setLogs([]);
  const toggleStream = () => setStreaming((s) => !s);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-zinc-300 font-medium mb-2 flex items-center gap-2">
          <FileText className="text-teal-400" size={18} />
          GitHub Activity Logs
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleStream}
            className={`text-xs ${
              streaming
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-emerald-600 hover:bg-emerald-700"
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

      {/* Log Display */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="font-medium text-zinc-200 mb-2">
          tail -f /var/log/github/events.log
        </div>

        <div className="font-mono text-xs bg-black/50 text-zinc-300 rounded-xl p-3 h-[480px] overflow-auto space-y-1">
          {loading && (
            <div className="text-zinc-500 text-center py-10 animate-pulse">
              Loading GitHub activity...
            </div>
          )}

          {!loading && logs.length === 0 && (
            <div className="text-zinc-600 text-center py-10">
              No recent activity yet — make a push or redeploy a workflow!
            </div>
          )}

          {[...logs].map((log) => {
            const cfg = categoryConfig[log.event_type] || categoryConfig.default;
            return (
              <div
                key={log.id}
                className={`flex items-center gap-2 ${cfg.color}`}
              >
                {cfg.icon}
                <span>{log.message}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="text-xs text-zinc-500 text-center">
        KobbyOps GitHub Stream —{" "}
        <span className="text-emerald-400">{logs.length}</span> entries loaded.
      </div>
    </div>
  );
}
