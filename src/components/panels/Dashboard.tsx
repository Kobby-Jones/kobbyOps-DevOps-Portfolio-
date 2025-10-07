"use client";
import { JSX, useEffect, useState } from "react";
import {
  Activity,
  GitBranch,
  Rocket,
  Terminal,
  Database,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface LogEntry {
  id: number;
  event_type: string;
  message: string;
  created_at: string;
}

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch("/api/webhook/github");
      const data = await res.json();
      if (Array.isArray(data.logs)) {
        setLogs(data.logs);
      }
      setLoading(false);
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Aggregate log stats
  const pushCount = logs.filter((l) => l.event_type === "push").length;
  const workflowCount = logs.filter((l) => l.event_type === "workflow_run").length;
  const createCount = logs.filter((l) => l.event_type === "create").length;
  const total = logs.length;

  // Build commits per hour (mock chart)
  const chartData = Array.from({ length: 12 }, (_, i) => ({
    time: `${i * 2}:00`,
    commits: logs.filter(
      (l) => l.event_type === "push" && new Date(l.created_at).getHours() === i * 2
    ).length,
  }));

  // Pie chart for event distribution
  const pieData = [
    { name: "Pushes", value: pushCount },
    { name: "Workflows", value: workflowCount },
    { name: "Creations", value: createCount },
  ];
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="text-teal-400" />
        <h2 className="text-zinc-200 font-semibold text-lg">DevOps Dashboard</h2>
      </div>

      {loading ? (
        <div className="text-zinc-500 animate-pulse">Loading dashboard...</div>
      ) : (
        <>
          {/* Overview Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Push Events"
              value={pushCount.toString()}
              icon={<GitBranch className="text-emerald-400" size={18} />}
            />
            <MetricCard
              title="Workflows"
              value={workflowCount.toString()}
              icon={<Rocket className="text-sky-400" size={18} />}
            />
            <MetricCard
              title="Repos Created"
              value={createCount.toString()}
              icon={<Database className="text-amber-400" size={18} />}
            />
            <MetricCard
              title="Total Events"
              value={total.toString()}
              icon={<Terminal className="text-zinc-400" size={18} />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Line Chart: Commit Activity */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
              <div className="text-zinc-300 font-medium mb-2">
                Commit Activity (Last 24h)
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="time" stroke="#71717a" />
                  <YAxis stroke="#71717a" />
                  <Tooltip
                    contentStyle={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="commits"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart: Event Breakdown */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
              <div className="text-zinc-300 font-medium mb-2">
                Event Type Distribution
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#09090b",
                      border: "1px solid #27272a",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Small reusable metric card
function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: JSX.Element;
}) {
  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-sm text-zinc-400">
        {icon}
        {title}
      </div>
      <div className="text-2xl font-semibold text-zinc-100">{value}</div>
    </div>
  );
}
