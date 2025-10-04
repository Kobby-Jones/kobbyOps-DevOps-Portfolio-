"use client";
import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Utility helpers
const rand = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

function buildSuccessData() {
  const hours = Array.from({ length: 12 }, (_, i) => i * 2);
  return hours.map((h) => ({
    time: `${h}:00`,
    success: rand(80, 100),
  }));
}

// Sample microservices (we'll later replace these with JSON)
const services = [
  {
    id: "prepgo",
    service: "PrepGo",
    status: "active",
    stack: "Flutter + Firebase + Functions",
    uptime: 142,
    requests: "2.3k/d",
    success_rate: 99.3,
    repo: "https://github.com/Kobby-Jones",
  },
  {
    id: "evote",
    service: "EVote",
    status: "active",
    stack: "Django + DRF + Next.js + MoMo",
    uptime: 88,
    requests: "1.1k/d",
    success_rate: 99.0,
    repo: "https://github.com/Kobby-Jones",
  },
  {
    id: "pos-suite",
    service: "POS Suite",
    status: "active",
    stack: "Django + SQLite (offline-first) + Flutter",
    uptime: 210,
    requests: "3.9k/d",
    success_rate: 99.7,
    repo: "https://github.com/Kobby-Jones",
  },
  {
    id: "facevault",
    service: "FaceVault Pro",
    status: "maintenance",
    stack: "Flutter + TFLite + Secure Storage",
    uptime: 31,
    requests: "350/d",
    success_rate: 98.6,
    repo: "https://github.com/Kobby-Jones",
  },
];

// Simple progress bar
function Progress({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-zinc-800 rounded-full">
      <div
        className="h-2 bg-teal-400 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

// StatCard component
function StatCard({
  title,
  value,
  sub,
}: {
  title: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 shadow-lg">
      <div className="text-zinc-400 text-sm">{title}</div>
      <div className="text-2xl font-semibold text-zinc-100 mt-1">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );
}

export default function Overview() {
  const [successData, setSuccessData] = useState(buildSuccessData());
  const [uptime, setUptime] = useState(99.99);

  useEffect(() => {
    const interval = setInterval(() => {
      setSuccessData((d) =>
        d.map((p) => ({
          ...p,
          success: Math.min(100, Math.max(60, p.success + rand(-5, 5))),
        }))
      );
      setUptime(99.9 + Math.random() * 0.1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      {/* Uptime + Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="System Uptime" value={`${uptime.toFixed(2)}%`} sub="Last 30 days" />
        <StatCard title="Last Deployment" value="Portfolio v2.0" sub="to prod · ~2 days ago" />
        <StatCard title="Region" value="Africa/Accra" sub="Latency: 24 ms" />
      </div>

      {/* Pipeline success chart */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-300 mb-2 font-medium">
          Pipeline Success Rate (last 24h)
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={successData}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" stroke="#71717a" />
              <YAxis stroke="#71717a" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: "#09090b",
                  border: "1px solid #27272a",
                }}
              />
              <Area
                type="monotone"
                dataKey="success"
                stroke="#14b8a6"
                fillOpacity={1}
                fill="url(#colorSuccess)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Active services */}
      <div>
        <div className="text-zinc-300 mb-2 font-medium">Active Microservices</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((s) => (
            <div
              key={s.id}
              className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4"
            >
              <div className="flex items-center justify-between">
                <div className="text-zinc-100 font-semibold">{s.service}</div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    s.status === "active"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <div className="text-xs text-zinc-500 mt-1">{s.stack}</div>
              <div className="grid grid-cols-3 gap-3 mt-3 text-sm">
                <div>
                  <div className="text-zinc-400">Uptime</div>
                  <div className="text-zinc-200 font-medium">{s.uptime}d</div>
                </div>
                <div>
                  <div className="text-zinc-400">Requests</div>
                  <div className="text-zinc-200 font-medium">{s.requests}</div>
                </div>
                <div>
                  <div className="text-zinc-400">Success</div>
                  <div className="text-zinc-200 font-medium">
                    {s.success_rate}%
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={s.success_rate} />
              </div>
              <div className="mt-3 text-right">
                <a
                  className="text-teal-300 text-xs hover:underline"
                  href={s.repo}
                  target="_blank"
                  rel="noreferrer"
                >
                  View repo ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
