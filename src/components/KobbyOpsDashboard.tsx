"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";

// --- Utility helpers ---
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const nowFmt = () => new Date().toLocaleString();

// --- Mock data builders ---
function buildSuccessData() {
  const hours = Array.from({ length: 12 }, (_, i) => i * 2);
  return hours.map((h) => ({
    time: `${h}:00`,
    success: rand(80, 100),
    fail: rand(0, 20),
  }));
}

function buildSkills() {
  return [
    { name: "Docker", level: 95, status: "Stable" },
    { name: "Kubernetes", level: 90, status: "Healthy" },
    { name: "Jenkins / CI", level: 85, status: "Running" },
    { name: "AWS", level: 78, status: "Scaling" },
    { name: "Terraform", level: 70, status: "Active" },
    { name: "Linux", level: 92, status: "Solid" },
  ];
}

function buildServices() {
  return [
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
}

export default function KobbyOpsDashboard() {

const [currentTime, setCurrentTime] = useState<string>("");

useEffect(() => {
  setCurrentTime(nowFmt());
}, []);

  // --- App State ---
  const [tab, setTab] = useState<
    "overview" | "skills" | "projects" | "deployments" | "logs" | "contact"
  >("overview");

  const [successData, setSuccessData] = useState(buildSuccessData());
  const [skills] = useState(buildSkills());
  const [services] = useState(buildServices());

  const [cpu, setCpu] = useState(36);
  const [mem, setMem] = useState(48);
  const [uptime, setUptime] = useState(99.99);

  const [alerts, setAlerts] = useState<string[]>([
    "New cert planned: AWS SAA — window scheduled",
    "Pipeline v2 rolled out to Projects/EVote",
    "Cost optimization task queued (S3 lifecycle)",
  ]);

  const [logs, setLogs] = useState<string[]>([
    `${nowFmt()}  INFO  KobbyOps boot sequence complete. Welcome, operator.`,
    `${nowFmt()}  INFO  Connected to GH repos → syncing stars & PR stats`,
  ]);

  const tailRef = useRef<HTMLDivElement | null>(null);

  // --- Effects: simulate live metrics ---
  useEffect(() => {
    const t = setInterval(() => {
      setCpu((v) => Math.min(100, Math.max(5, v + rand(-10, 12))));
      setMem((v) => Math.min(100, Math.max(10, v + rand(-6, 8))));
      setUptime(99.9 + Math.random() * 0.1);
      setSuccessData((d) => d.map((p) => ({ ...p, success: Math.min(100, Math.max(60, p.success + rand(-5, 5))) })));

      // Occasionally push an alert or log
      if (Math.random() > 0.8) {
        setAlerts((a) => [
          `${new Date().toLocaleTimeString()}  Notice: Auto-scaler adjusted nodes to ${rand(3, 6)}`,
          ...a.slice(0, 4),
        ]);
      }
      if (Math.random() > 0.6) {
        setLogs((l) => [
          `${nowFmt()}  DEPLOY  portfolio@main → prod  status=success  duration=${rand(23, 75)}s`,
          ...l,
        ]);
      }
    }, 2500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    tailRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const radialData = useMemo(
    () => [
      { name: "CPU (energy)", value: cpu, fill: "#22c55e" },
      { name: "Mem (learning)", value: mem, fill: "#06b6d4" },
    ],
    [cpu, mem]
  );

  // --- UI building blocks ---
  const NavItem = ({ id, label, emoji }: { id: typeof tab; label: string; emoji: string }) => (
    <button
      onClick={() => setTab(id)}
      className={`w-full text-left px-3 py-2 rounded-xl mb-1 transition hover:bg-zinc-800/60 ${
        tab === id ? "bg-zinc-800 text-teal-300" : "text-zinc-300"
      }`}
    >
      <span className="mr-2">{emoji}</span>
      {label}
    </button>
  );

  const StatCard = ({ title, value, sub }: { title: string; value: string; sub?: string }) => (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 shadow-lg">
      <div className="text-zinc-400 text-sm">{title}</div>
      <div className="text-2xl font-semibold text-zinc-100 mt-1">{value}</div>
      {sub && <div className="text-xs text-zinc-500 mt-1">{sub}</div>}
    </div>
  );

  const Progress = ({ value }: { value: number }) => (
    <div className="w-full h-2 bg-zinc-800 rounded-full">
      <div
        className="h-2 bg-teal-400 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  // --- Main Views ---
  const Overview = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="System Uptime" value={`${uptime.toFixed(2)}%`} sub="Last 30 days" />
        <StatCard title="Last Deployment" value="Portfolio v2.0" sub="to prod · ~2 days ago" />
        <StatCard title="Region" value="Africa/Accra" sub="Latency: 24 ms" />
      </div>

      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-300 mb-2 font-medium">Pipeline Success Rate (last 24h)</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={successData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSuccess" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="time" stroke="#71717a" />
              <YAxis stroke="#71717a" domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a" }} />
              <Area type="monotone" dataKey="success" stroke="#14b8a6" fillOpacity={1} fill="url(#colorSuccess)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <div className="text-zinc-300 mb-2 font-medium">Active Microservices</div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {services.map((s) => (
            <div key={s.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-zinc-100 font-semibold">{s.service}</div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    s.status === "active" ? "bg-emerald-500/20 text-emerald-300" : "bg-yellow-500/20 text-yellow-300"
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
                  <div className="text-zinc-200 font-medium">{s.success_rate}%</div>
                </div>
              </div>
              <div className="mt-3">
                <Progress value={Math.min(100, Math.max(0, s.success_rate))} />
              </div>
              <div className="mt-3 text-right">
                <a className="text-teal-300 text-xs hover:underline" href={s.repo} target="_blank" rel="noreferrer">
                  View repo ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const Skills = () => (
    <div className="space-y-3">
      {skills.map((sk) => (
        <div key={sk.name} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="text-zinc-200 font-medium">{sk.name}</div>
            <div className="text-xs text-zinc-400">{sk.status}</div>
          </div>
          <div className="mt-2 flex items-center gap-3">
            <Progress value={sk.level} />
            <div className="text-zinc-400 text-sm w-12 text-right">{sk.level}%</div>
          </div>
        </div>
      ))}
    </div>
  );

  const Projects = () => (
    <div className="space-y-4">
      {services.map((s) => (
        <div key={s.id} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="text-zinc-100 font-semibold text-lg">{s.service}</div>
              <div className="text-zinc-500 text-sm">{s.stack}</div>
            </div>
            <div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                {s.status}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
            <StatCard title="Uptime" value={`${s.uptime} days`} />
            <StatCard title="Success Rate" value={`${s.success_rate}%`} />
            <StatCard title="Daily Requests" value={s.requests} />
            <StatCard title="Repository" value="GitHub" sub="View code ↗" />
          </div>
          <div className="mt-4 text-right">
            <a className="text-teal-300 text-sm hover:underline" href={s.repo} target="_blank" rel="noreferrer">
              Open repository ↗
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  const Deployments = () => {
    const steps = [
      { name: "Fetch source", done: true },
      { name: "Install deps", done: true },
      { name: "Run tests", done: true },
      { name: "Build artifacts", done: true },
      { name: "Deploy to prod", done: true },
    ];
    const progress = 100;
    return (
      <div className="space-y-4">
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
          <div className="font-medium text-zinc-200 mb-2">CI/CD Pipeline · portfolio@main</div>
          <Progress value={progress} />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mt-3">
            {steps.map((s) => (
              <div key={s.name} className="text-xs text-zinc-300 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${s.done ? "bg-emerald-400" : "bg-zinc-600"}`} />
                {s.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
          <div className="font-medium text-zinc-200 mb-2">Recent Deploy Logs</div>
          <div className="font-mono text-xs text-zinc-300 bg-black/50 rounded-xl p-3 h-56 overflow-auto">
            {[...logs].reverse().map((line, idx) => (
              <div key={idx} className="whitespace-pre">
                {line}
              </div>
            ))}
            <div ref={tailRef} />
          </div>
        </div>
      </div>
    );
  };

  const Logs = () => (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
      <div className="font-medium text-zinc-200 mb-2">tail -f /var/log/kobby/ops.log</div>
      <div className="font-mono text-xs text-zinc-300 bg-black/50 rounded-xl p-3 h-[480px] overflow-auto">
        {[...logs].reverse().map((line, idx) => (
          <div key={idx} className="whitespace-pre">
            {line}
          </div>
        ))}
        <div ref={tailRef} />
      </div>
    </div>
  );

  const Contact = () => (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
      <div className="font-medium text-zinc-200 mb-2">Contact API</div>
      <pre className="font-mono text-sm text-teal-300 bg-black/50 rounded-xl p-3 overflow-auto">
        {JSON.stringify(
          {
            status: "online",
            message: "Thanks for connecting!",
            email: "kobbyj099@gmail.com",
            github: "github.com/Kobby-Jones",
            linkedin: "linkedin.com/in/kobby-jones",
            region: "Africa/Accra",
          },
          null,
          2
        )}
      </pre>
    </div>
  );

  // --- Sidebar widgets ---
  const RightSidebar = () => (
    <div className="space-y-4">
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
        <div className="text-zinc-300 mb-2 font-medium">Uptime</div>
        <div className="text-2xl font-semibold text-zinc-100">{uptime.toFixed(2)}%</div>
        <div className="text-xs text-zinc-500">Last 30 days</div>
      </div>

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
              <Tooltip contentStyle={{ background: "#09090b", border: "1px solid #27272a" }} />
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-950 to-black text-zinc-100">
      {/* Top bar */}
      <div className="sticky top-0 z-30 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full animate-pulse" />
              <div className="h-8 w-8 rounded-xl bg-zinc-900 border border-zinc-800 grid place-content-center font-bold">K</div>
            </div>
            <div>
              <div className="font-semibold">KobbyOps — DevOps Command Center</div>
              <div className="text-xs text-zinc-400">Monitoring the life, skills, and deployments of Kobby-Jones</div>
            </div>
          </div>
          <div className="text-xs text-zinc-400">{currentTime || "Loading..."}</div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-6">
        {/* Left nav */}
        <aside className="bg-zinc-950/60 border border-zinc-800 rounded-2xl p-3 h-fit">
          <div className="text-zinc-400 text-xs mb-2">Navigation</div>
          <NavItem id="overview" label="Overview" emoji="🧠" />
          <NavItem id="skills" label="Skills" emoji="🧰" />
          <NavItem id="projects" label="Projects" emoji="☁️" />
          <NavItem id="deployments" label="Deployments" emoji="🚀" />
          <NavItem id="logs" label="Logs" emoji="📜" />
          <NavItem id="contact" label="Contact" emoji="📞" />
        </aside>

        {/* Main */}
        <main className="space-y-6">
          {tab === "overview" && <Overview />}
          {tab === "skills" && <Skills />}
          {tab === "projects" && <Projects />}
          {tab === "deployments" && <Deployments />}
          {tab === "logs" && <Logs />}
          {tab === "contact" && <Contact />}
        </main>

        {/* Right widgets */}
        <aside className="hidden lg:block">
          <RightSidebar />
        </aside>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 pb-10 text-xs text-zinc-500">
        <div className="border-t border-zinc-800 pt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Kobby-Jones — Crafted with React & Tailwind. Theme: Grafana-inspired.
          </div>
          <div className="space-x-3">
            <a href="https://github.com/Kobby-Jones" target="_blank" rel="noreferrer" className="hover:text-teal-300">GitHub</a>
            <a href="#" className="hover:text-teal-300">LinkedIn</a>
            <a href="#" className="hover:text-teal-300">Resume</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
