"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Tooltip,
} from "recharts";

// helper to simulate system values
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export default function RightSidebar() {
  const [cpu, setCpu] = useState(36);
  const [mem, setMem] = useState(48);
  const [uptime, setUptime] = useState(99.99);
  const [alerts, setAlerts] = useState<string[]>([
    "New cert planned: AWS SAA — window scheduled",
    "Pipeline v2 rolled out to Projects/EVote",
    "Cost optimization task queued (S3 lifecycle)",
  ]);

  // simulate live metric changes
  useEffect(() => {
    const t = setInterval(() => {
      setCpu((v) => Math.min(100, Math.max(5, v + rand(-10, 12))));
      setMem((v) => Math.min(100, Math.max(10, v + rand(-6, 8))));
      setUptime(99.9 + Math.random() * 0.1);

      if (Math.random() > 0.8) {
        setAlerts((a) => [
          `${new Date().toLocaleTimeString()} Notice: Auto-scaler adjusted nodes to ${rand(3, 6)}`,
          ...a.slice(0, 4),
        ]);
      }
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const radialData = useMemo(
    () => [
      { name: "CPU (energy)", value: cpu, fill: "#22c55e" },
      { name: "Mem (learning)", value: mem, fill: "#06b6d4" },
    ],
    [cpu, mem]
  );

  return (
    <div className="space-y-4">
      {/* Uptime */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-300 mb-2 font-medium">Uptime</div>
        <div className="text-2xl font-semibold text-zinc-100">
          {uptime.toFixed(2)}%
        </div>
        <div className="text-xs text-zinc-500">Last 30 days</div>
      </div>

      {/* System Meters */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-300 mb-3 font-medium">System Meters</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart
              cx="50%"
              cy="50%"
              innerRadius="20%"
              outerRadius="100%"
              barSize={16}
              data={radialData}
            >
              <RadialBar minAngle={15} background clockWise dataKey="value" />
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid #27272a",
                }}
              />
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-zinc-400">CPU (energy)</div>
            <div className="text-zinc-200 font-semibold">{cpu}%</div>
          </div>
          <div>
            <div className="text-zinc-400">Mem (learning)</div>
            <div className="text-zinc-200 font-semibold">{mem}%</div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-300 mb-2 font-medium">Alerts</div>
        <ul className="text-sm text-zinc-300 space-y-2">
          {alerts.map((a, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="h-2 w-2 rounded-full bg-yellow-300 mt-2" />
              <span>{a}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
